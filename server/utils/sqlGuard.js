const { Parser } = require("node-sql-parser");

const parser = new Parser();
const PARSER_OPTS = { database: "PostgreSQL" };

// Allowed top-level statement types from Gemini-generated SQL.
const ALLOWED_TYPES = new Set(["select"]);

/**
 * Validate an AI-generated SQL string before execution.
 * Rejects multi-statement queries, non-SELECT statements,
 * and anything that fails to parse as PostgreSQL.
 *
 * @param {string} sql
 * @returns {{ ok: true } | { ok: false, reason: string }}
 */
exports.validateReadOnlySql = (sql) => {
    if (typeof sql !== "string" || !sql.trim()) {
        return { ok: false, reason: "Empty SQL." };
    }

    let ast;
    try {
        ast = parser.astify(sql, PARSER_OPTS);
    } catch (e) {
        return { ok: false, reason: `Unparseable SQL: ${e.message}` };
    }

    const statements = Array.isArray(ast) ? ast : [ast];
    if (statements.length !== 1) {
        return { ok: false, reason: "Multiple statements are not allowed." };
    }

    const type = (statements[0].type || "").toLowerCase();
    if (!ALLOWED_TYPES.has(type)) {
        return { ok: false, reason: `Statement type "${type}" is not allowed. Only SELECT is permitted.` };
    }

    return { ok: true };
};
