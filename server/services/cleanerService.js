const pool = require('../config/pg');
const prisma = require('../config/db');


const TYPE_THRESHOLD = 0.8; // 80% of data must match a type to be cast to that type

const REGEX_BOOLEAN = /^(true|false|yes|no|1|0)$/i;
const REGEX_INTEGER = /^-?\d+$/;
const REGEX_FLOAT = /^-?\d+(\.\d+)?$/; 
const REGEX_NON_DIGITS = '[^0-9-]';
const REGEX_NON_FLOAT = '[^0-9.-]';


// Analyze a bunch of values and figure out their type
const inferType = (values) => {
    let counts = {
        INTEGER: 0,
        FLOAT: 0,
        BOOLEAN: 0,
        TIMESTAMP: 0,
        TOTAL: 0
    };

    values.forEach(value => {
        if (value === null || value === '' || value === undefined) return;
        
        const strVal = String(value).trim();
        counts.TOTAL++;

        if (REGEX_BOOLEAN.test(strVal)) counts.BOOLEAN++;
        if (REGEX_INTEGER.test(strVal)) counts.INTEGER++;
        if (REGEX_FLOAT.test(strVal))   counts.FLOAT++;

        const isDate = !isNaN(Date.parse(strVal));
        const isNotNumber = !REGEX_INTEGER.test(strVal);
        if (isDate && strVal.length > 5 && isNotNumber) {
            counts.TIMESTAMP++;
        }
    });

    if (counts.TOTAL === 0) return 'TEXT';

    const ratio = (count) => count / counts.TOTAL;

    if (ratio(counts.BOOLEAN) > TYPE_THRESHOLD) return 'BOOLEAN';
    if (ratio(counts.INTEGER) > TYPE_THRESHOLD) return 'INTEGER';
    if (ratio(counts.FLOAT)   > TYPE_THRESHOLD) return 'FLOAT';
    if (ratio(counts.TIMESTAMP) > TYPE_THRESHOLD) return 'TIMESTAMP';

    return 'TEXT';
};


// Generates the SQL command to convert a column to the identified type

const generateCastQuery = (tableName, columnName, targetType) => {
    switch (targetType) {
        case 'INTEGER':
            return `
                ALTER TABLE ${tableName} 
                ALTER COLUMN ${columnName} TYPE INTEGER 
                USING NULLIF(REGEXP_REPLACE(${columnName}, '${REGEX_NON_DIGITS}', '', 'g'), '')::INTEGER
            `;
        case 'FLOAT':
            return `
                ALTER TABLE ${tableName} 
                ALTER COLUMN ${columnName} TYPE FLOAT 
                USING NULLIF(REGEXP_REPLACE(${columnName}, '${REGEX_NON_FLOAT}', '', 'g'), '')::FLOAT
            `;
        case 'BOOLEAN':
            return `
                ALTER TABLE ${tableName} 
                ALTER COLUMN ${columnName} TYPE BOOLEAN 
                USING CASE 
                    WHEN ${columnName} ~* '^(true|yes|1)$' THEN true 
                    WHEN ${columnName} ~* '^(false|no|0)$' THEN false 
                    ELSE NULL 
                END
            `;
        case 'TIMESTAMP':
            return `
                ALTER TABLE ${tableName} 
                ALTER COLUMN ${columnName} TYPE TIMESTAMP 
                USING ${columnName}::TIMESTAMP
            `;
        default:
            return null;
    }
};


exports.cleanDataset = async (datasetId) => {

    const dataset = await prisma.dataset.findUnique({ where: { id: datasetId } });
    if (!dataset) return;

    // 2. Get Column Names
    const { rows: columns } = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${dataset.tableName}' 
        AND column_name != 'id'
    `);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // We count the total rows in the table first.
        const countQuery = `SELECT COUNT(*) as total FROM ${dataset.tableName}`;
        const { rows: countResult } = await client.query(countQuery);
        
        const totalRows = parseInt(countResult[0].total, 10);
        
        // Use 50% of the total rows as sample size
        const sampleSize = Math.ceil(totalRows / 2);

        console.log(`Analyzing table: ${dataset.tableName} | Total Rows: ${totalRows} | Sample Size: ${sampleSize}`);

        // Loop through each columns
        for (const col of columns) {
            const name = col.column_name;

            if (sampleSize > 0) {
                
                const sampleQuery = `
                    SELECT ${name} as v 
                    FROM ${dataset.tableName} 
                    WHERE ${name} IS NOT NULL AND ${name} != '' 
                    LIMIT ${sampleSize}
                `;
                
                const { rows: samples } = await client.query(sampleQuery);
                const sampleValues = samples.map(s => s.v);


                const inferredType = inferType(sampleValues);
                console.log(`Column [${name}] inferred as: ${inferredType}`);

                if (inferredType !== 'TEXT') {
                    try {
                        const alterQuery = generateCastQuery(dataset.tableName, name, inferredType);
                        if (alterQuery) {
                            await client.query(alterQuery);
                        }
                    } catch (castError) {
                        console.warn(`Failed to cast [${name}] to ${inferredType}. Reverting to TEXT.`);
                    }
                }

                await prisma.datasetSchema.create({
                    data: {
                        datasetId: dataset.id,
                        columnName: name,
                        dataType: inferredType
                    }
                });
            } else {
                await prisma.datasetSchema.create({
                    data: {
                        datasetId: dataset.id,
                        columnName: name,
                        dataType: 'TEXT'
                    }
                });
            }
        }
        await prisma.dataset.update({
            where: { id: datasetId },
            data: { status: 'READY' }
        });

        await client.query('COMMIT');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Cleaning Service Error:", error);
    } finally {
        client.release();
    }
};