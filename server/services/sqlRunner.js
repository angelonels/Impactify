const pool = require("../config/pg");

const STATEMENT_TIMEOUT_MS = parseInt(process.env.ANALYZE_STATEMENT_TIMEOUT_MS || "10000", 10);

/**
 * Wrap an AI-generated SELECT in a row-limited subquery so a missing LIMIT
 * cannot blow up the response. Idempotent: if a smaller LIMIT exists, the
 * outer one is a no-op.
 */
function withRowCap(sql, rowCap) {
    const trimmed = sql.trim().replace(/;+\s*$/g, "");
    return `SELECT * FROM (${trimmed}) AS _capped LIMIT ${rowCap}`;
}

/**
 * Execute AI-generated SQL in a read-only transaction with a statement timeout
 * and a hard row cap. Caller must have already validated the SQL through sqlGuard.
 *
 * @param {string} sql
 * @param {{ rowCap?: number }} opts
 * @returns {Promise<object[]>}
 */
exports.runReadOnlyQuery = async (sql, { rowCap = 5000 } = {}) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN READ ONLY");
        await client.query(`SET LOCAL statement_timeout = ${STATEMENT_TIMEOUT_MS}`);
        const { rows } = await client.query(withRowCap(sql, rowCap));
        await client.query("COMMIT");
        return rows;
    } catch (err) {
        try { await client.query("ROLLBACK"); } catch (_) {}
        throw err;
    } finally {
        client.release();
    }
};
