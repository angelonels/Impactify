const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../config/pg");
const prisma = require("../config/db");

// Funtion to properly clean and format column name for use
const sanitizeHeader = (header) => {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_"); // Replace non-alphanumeric chars with underscores
};

// Sanitize a cell value for SQL insertion.
// Empty or whitespace-only strings become NULL so that IS NOT NULL filters work correctly.
const sanitizeValue = (value) => {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  if (trimmed === '') return null;          // treat blank cells as NULL
  return trimmed.replace(/'/g, "''");       // escape single quotes
};

// Parses Csv and returns headers and rows
const parseCsvFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    let headers = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (rawHeaders) => {
        headers = rawHeaders.map(sanitizeHeader);
      })
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        resolve({ headers, rows });
      })
      .on("error", (error) => {
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

    // Rename 'id' column if it exists to avoid conflict with system primary key
    const safeHeaders = headers.map((h) => (h === "id" ? "csv_id" : h));

    // Start a Database Transaction
    await client.query("BEGIN");

    const dataset = await prisma.dataset.create({
      data: {
        userId: userId,
        datasetName: originalName,
        tableName: tableName,
        status: "PROFILING",
      },
    });

    // We set all columns to TEXT at the start to avoid type errors during insertion
    const columnDefinitions = safeHeaders
      .map((header) => `${header} TEXT`)
      .join(", ");
    const createTableQuery = `CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, ${columnDefinitions})`;

    await client.query(createTableQuery);

    // Insert Data (Batch Insert)
    const BATCH_SIZE = 500;
    let batchValues = [];

    for (const row of rows) {
      // Map original headers -> sanitized values in safeHeaders order
      const sqlRow = headers
        .map((header) => {
          const sanitized = sanitizeValue(row[header]);
          return sanitized === null ? 'NULL' : `'${sanitized}'`;
        })
        .join(', ');

      batchValues.push(`(${sqlRow})`);

      if (batchValues.length >= BATCH_SIZE) {
        const insertQuery = `INSERT INTO ${tableName} (${safeHeaders.join(
          ","
        )}) VALUES ${batchValues.join(",")}`;
        await client.query(insertQuery);
        batchValues = [];
      }
    }

    // Insert remaining rows
    if (batchValues.length > 0) {
      const insertQuery = `INSERT INTO ${tableName} (${safeHeaders.join(
        ","
      )}) VALUES ${batchValues.join(",")}`;
      await client.query(insertQuery);
    }

    // Commit the transaction.
    await client.query("COMMIT");
    return dataset;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    // Delete temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
