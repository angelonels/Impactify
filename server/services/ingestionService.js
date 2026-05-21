const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const pool = require("../config/pg");
const prisma = require("../config/db");

// Postgres caps parameters per query at 65535; stay well below.
const MAX_PARAMS_PER_INSERT = 30000;

const sanitizeHeader = (header) => {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");
};

// Normalize a cell value: blank strings → NULL so IS NOT NULL filters work.
const normalizeCell = (value) => {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
};

// Parses CSV and returns sanitized headers + rows (rows keyed by ORIGINAL header).
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
      .on("error", reject);
  });
};

// Parses XLSX. Uses the first non-empty sheet. Returns the same shape as parseCsvFile.
const parseXlsxFile = (filePath) => {
  const wb = XLSX.readFile(filePath, { cellDates: true });
  const sheetName = wb.SheetNames.find((n) => wb.Sheets[n] && Object.keys(wb.Sheets[n]).length > 1) || wb.SheetNames[0];
  if (!sheetName) throw new Error("Workbook contains no sheets.");
  const sheet = wb.Sheets[sheetName];

  // header:1 gives array-of-arrays; first row = headers.
  const rowsArr = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", blankrows: false, raw: false });
  if (rowsArr.length === 0) throw new Error(`Sheet "${sheetName}" is empty.`);

  const rawHeaders = (rowsArr[0] || []).map((h) => String(h ?? ""));
  const headers = rawHeaders.map(sanitizeHeader);

  // Build row objects keyed by original headers so rest of pipeline works.
  const rows = rowsArr.slice(1).map((arr) => {
    const o = {};
    rawHeaders.forEach((h, i) => { o[h] = arr[i] === undefined ? "" : arr[i]; });
    return o;
  });

  return { headers, rows, rawHeaders };
};

const parseAny = async (filePath, originalName) => {
  const ext = (path.extname(originalName || filePath) || "").toLowerCase();
  if (ext === ".xlsx" || ext === ".xls") {
    return parseXlsxFile(filePath);
  }
  return parseCsvFile(filePath);
};

exports.ingestFile = async (filePath, userId, originalName) => {
  // Generate unique name for each dataset uploaded by the user using timestamp,randomnumber and table name so that no two dataset have the same name
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const tableName = `ds_${timestamp}_${randomString}`;

  const client = await pool.connect();

  try {
    // Get the headers and rows from the CSV or XLSX file
    const parsed = await parseAny(filePath, originalName);
    const { headers, rows } = parsed;
    // For XLSX we keyed rows by original headers; for CSV csv-parser uses raw headers too.
    // Both shapes are consumed below via `headers.map((header) => row[header])`.

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

    // Parameterized batch insert. Size each batch so we stay under Postgres'
    // 65535 param cap regardless of column count.
    const colsPerRow = safeHeaders.length;
    const rowsPerBatch = Math.max(1, Math.floor(MAX_PARAMS_PER_INSERT / Math.max(colsPerRow, 1)));
    const colList = safeHeaders.join(", ");

    const flushBatch = async (batchRows) => {
      if (batchRows.length === 0) return;
      const params = [];
      const valueGroups = batchRows.map((row) => {
        const placeholders = headers.map((h) => {
          params.push(normalizeCell(row[h]));
          return `$${params.length}`;
        });
        return `(${placeholders.join(", ")})`;
      });
      await client.query(
        `INSERT INTO ${tableName} (${colList}) VALUES ${valueGroups.join(", ")}`,
        params
      );
    };

    for (let i = 0; i < rows.length; i += rowsPerBatch) {
      await flushBatch(rows.slice(i, i + rowsPerBatch));
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
