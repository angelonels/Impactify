const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../config/pg');
const prisma = require('../config/db');

// Funtion to properly clean and format column name for use
const sanitizeHeader = (header) => {
    return header
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_'); // Replace non-alphanumeric chars with underscores
};


// To prevent single quote errors in SQL 
const escapeSqlString = (value) => {
    if (value === null || value === undefined) return null;
    return value.replace(/'/g, "''");
};


// Parses Csv and returns headers and rows
const parseCsvFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const rows = [];
        let headers = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('headers', (rawHeaders) => {
                headers = rawHeaders.map(sanitizeHeader);
            })
            .on('data', (row) => {
                rows.push(row);
            })
            .on('end', () => {
                resolve({ headers, rows });
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

exports.ingestFile = async (filePath, userId, originalName) => {
// Generate unique name for each dataset uploaded by the user using timestamp,randomnumber and table name so that no two dataset have the same name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const tableName = `ds_${timestamp}_${randomString}`;

    const client = await pool.connect();

    try {
        // Get the headers and rows from the CSV file
        const { headers, rows } = await parseCsvFile(filePath);

        // Start a Database Transaction
        await client.query('BEGIN');

        const dataset = await prisma.dataset.create({
            data: {
                userId: userId,
                datasetName: originalName,
                tableName: tableName,
                status: 'PROFILING'
            }
        });

        // We set all columns to TEXT at the start to avoid type errors during insertion
        const columnDefinitions = headers.map(header => `${header} TEXT`).join(', ');
        const createTableQuery = `CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, ${columnDefinitions})`;
        
        await client.query(createTableQuery);

        //Insert Data (Row by Row)
        for (const row of rows) {
            // Get values in the same order as headers
            const rawValues = Object.values(row);
            
            // Clean the values (escape quotes)
            const escapedValues = rawValues.map(escapeSqlString);

            // Format for SQL: NULL if empty, otherwise wrap in single quotes
            const sqlValues = escapedValues.map(val => 
                val === null ? 'NULL' : `'${val}'`
            ).join(', ');

            // Construct and execute the INSERT query
            const insertQuery = `INSERT INTO ${tableName} (${headers.join(',')}) VALUES (${sqlValues})`;
            await client.query(insertQuery);
        }

        // Commit the transaction.
        await client.query('COMMIT');
        return dataset;

    } catch (error) {

        await client.query('ROLLBACK');
        throw error; 

    } finally {
        client.release(); 
// Delete temporary file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};