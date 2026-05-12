const pool = require('../config/pg');
const prisma = require('../config/db');

const TYPE_THRESHOLD  = 0.8;
const REGEX_BOOLEAN   = /^(true|false|yes|no|1|0)$/i;
const REGEX_INTEGER   = /^-?\d+$/;
const REGEX_FLOAT     = /^-?\d+(\.\d+)?$/;
const REGEX_NON_DIGITS = '[^0-9-]';
const REGEX_NON_FLOAT  = '[^0-9.-]';


// Analyze a sample of non-null values and infer their SQL type
const inferType = (values) => {
    const counts = { INTEGER: 0, FLOAT: 0, BOOLEAN: 0, TIMESTAMP: 0, TOTAL: 0 };

    for (const value of values) {
        if (value === null || value === '' || value === undefined) continue;

        const strVal = String(value).trim();
        counts.TOTAL++;

        if (REGEX_BOOLEAN.test(strVal)) counts.BOOLEAN++;
        if (REGEX_INTEGER.test(strVal)) counts.INTEGER++;
        if (REGEX_FLOAT.test(strVal))   counts.FLOAT++;

        const isDate      = !isNaN(Date.parse(strVal));
        const isNotNumber = !REGEX_INTEGER.test(strVal);
        if (isDate && strVal.length > 5 && isNotNumber) counts.TIMESTAMP++;
    }

    if (counts.TOTAL === 0) return 'TEXT';

    const ratio = (n) => n / counts.TOTAL;
    if (ratio(counts.BOOLEAN)   > TYPE_THRESHOLD) return 'BOOLEAN';
    if (ratio(counts.INTEGER)   > TYPE_THRESHOLD) return 'INTEGER';
    if (ratio(counts.FLOAT)     > TYPE_THRESHOLD) return 'FLOAT';
    if (ratio(counts.TIMESTAMP) > TYPE_THRESHOLD) return 'TIMESTAMP';
    return 'TEXT';
};


// Generate the ALTER TABLE … TYPE statement to cast a single column
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
                    WHEN ${columnName} ~* '^(true|yes|1)$'  THEN true
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

    // Fetch column names (excluding the auto-generated primary key 'id')
    const { rows: columns } = await pool.query(
        `SELECT column_name
         FROM information_schema.columns
         WHERE table_name = $1
           AND column_name != 'id'
         ORDER BY ordinal_position`,
        [dataset.tableName]
    );

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // ── Step 1: Delete fully-empty rows ──────────────────────────────────────
        // Blank CSV lines are stored as all-NULL rows; remove them before analysis.
        const colList = columns.map(c => c.column_name);
        if (colList.length > 0) {
            const nullChecks = colList
                .map(c => `(${c} IS NULL OR TRIM(${c}::TEXT) = '')`)
                .join(' AND ');
            const { rowCount } = await client.query(
                `DELETE FROM ${dataset.tableName} WHERE ${nullChecks}`
            );
            if (rowCount > 0) {
                console.log(`  Removed ${rowCount} empty rows from ${dataset.tableName}`);
            }
        }

        // ── Step 2: Count remaining rows ─────────────────────────────────────────
        const { rows: [{ total }] } = await client.query(
            `SELECT COUNT(*) AS total FROM ${dataset.tableName}`
        );
        const totalRows  = parseInt(total, 10);
        const sampleSize = Math.max(1, Math.ceil(totalRows / 2));

        console.log(`Cleaning ${dataset.tableName} | rows=${totalRows} | sample=${sampleSize}`);

        // ── Step 3: Infer type and attempt cast for every column ─────────────────
        for (const col of columns) {
            const name = col.column_name;

            // Sample non-null, non-empty values only
            const { rows: samples } = await client.query(
                `SELECT ${name} AS v
                 FROM ${dataset.tableName}
                 WHERE ${name} IS NOT NULL
                   AND TRIM(${name}::TEXT) != ''
                 LIMIT $1`,
                [sampleSize]
            );

            const sampleValues = samples.map(s => s.v);
            const inferredType = sampleValues.length > 0 ? inferType(sampleValues) : 'TEXT';

            console.log(`  [${name}] → ${inferredType}`);

            // Use a SAVEPOINT so a failed cast only rolls back this column,
            // not the entire cleaning transaction.
            if (inferredType !== 'TEXT') {
                const sp = `sp_${name.replace(/\W/g, '_')}`;
                try {
                    await client.query(`SAVEPOINT ${sp}`);
                    const alterSql = generateCastQuery(dataset.tableName, name, inferredType);
                    if (alterSql) await client.query(alterSql);
                    await client.query(`RELEASE SAVEPOINT ${sp}`);
                } catch (castErr) {
                    await client.query(`ROLLBACK TO SAVEPOINT ${sp}`);
                    console.warn(`  ⚠ Cast [${name}]→${inferredType} failed, stays TEXT. (${castErr.message})`);
                }
            }

            // Persist schema entry — create or update
            const existing = await prisma.datasetSchema.findFirst({
                where: { datasetId: dataset.id, columnName: name }
            });
            if (existing) {
                await prisma.datasetSchema.update({
                    where: { id: existing.id },
                    data:  { dataType: inferredType }
                });
            } else {
                await prisma.datasetSchema.create({
                    data: { datasetId: dataset.id, columnName: name, dataType: inferredType }
                });
            }
        }

        // Mark dataset ready and commit
        await prisma.dataset.update({
            where: { id: datasetId },
            data:  { status: 'READY' }
        });

        await client.query('COMMIT');
        console.log(`✓ Dataset ${datasetId} cleaning complete.`);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Cleaning Service Error:', error);

        // Mark dataset as errored so the UI can surface the problem
        await prisma.dataset.update({
            where: { id: datasetId },
            data:  { status: 'ERROR' }
        }).catch(() => {});
    } finally {
        client.release();
    }
};