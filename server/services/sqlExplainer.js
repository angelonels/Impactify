const { Parser } = require("node-sql-parser");

const parser = new Parser();
const OPTS = { database: "PostgreSQL" };

function colName(col) {
    if (!col) return "?";
    if (typeof col === "string") return col;
    if (col.expr && col.expr.value !== undefined) return col.expr.value;
    if (col.value !== undefined) return col.value;
    return "?";
}

function fmtExpr(e) {
    if (e === null || e === undefined) return "?";
    if (typeof e === "string") return `"${e}"`;
    switch (e.type) {
        case "column_ref": {
            const name = colName(e.column);
            return name === "*" ? "all columns" : `"${name}"`;
        }
        case "aggr_func": {
            const inner = e.args && (e.args.expr || e.args);
            return `${String(e.name).toUpperCase()} of ${fmtExpr(inner)}`;
        }
        case "function": {
            const fname = e.name?.name?.[0]?.value || (typeof e.name === "string" ? e.name : "fn");
            const argList = e.args?.value || e.args?.expr || [];
            const args = Array.isArray(argList) ? argList.map(fmtExpr).join(", ") : fmtExpr(argList);
            return `${String(fname).toUpperCase()}(${args})`;
        }
        case "number":
            return String(e.value);
        case "single_quote_string":
        case "string":
            return JSON.stringify(e.value);
        case "binary_expr":
            return `${fmtExpr(e.left)} ${e.operator} ${fmtExpr(e.right)}`;
        case "expr_list":
            return (e.value || []).map(fmtExpr).join(", ");
        case "default":
            return JSON.stringify(e.value);
        case "star":
        case "*":
            return "all columns";
        default:
            if (e.column !== undefined) return `"${colName(e.column)}"`;
            if (e.value !== undefined) return JSON.stringify(e.value);
            return e.type || "?";
    }
}

function explainSelectList(columns) {
    if (!columns) return "all columns";
    if (columns === "*") return "all columns";
    if (!Array.isArray(columns)) return "selected columns";
    return columns
        .map((c) => {
            const target = c.expr ? fmtExpr(c.expr) : fmtExpr(c);
            const label = c.as ? ` (aliased "${c.as}")` : "";
            return `${target}${label}`;
        })
        .join(", ");
}

function explainFrom(from) {
    if (!Array.isArray(from) || from.length === 0) return null;
    return from.map((f) => f.table || (f.expr ? fmtExpr(f.expr) : "?")).join(", ");
}

function explainWhere(where) {
    return where ? `filtering rows where ${fmtExpr(where)}` : null;
}

function explainGroupBy(groupby) {
    if (!groupby) return null;
    const list = Array.isArray(groupby) ? groupby : groupby.columns || [];
    if (!list.length) return null;
    const cols = list.map(fmtExpr).join(", ");
    return `grouped by ${cols}`;
}

function explainOrderBy(orderby) {
    if (!orderby || !Array.isArray(orderby) || orderby.length === 0) return null;
    const parts = orderby.map((o) => `${fmtExpr(o.expr)} ${(o.type || "ASC").toUpperCase()}`);
    return `ordered by ${parts.join(", ")}`;
}

function explainLimit(limit) {
    if (!limit) return null;
    const arr = limit.value;
    let n;
    if (Array.isArray(arr) && arr[0]) n = arr[0].value;
    else if (typeof limit.value === "number") n = limit.value;
    if (n === undefined || n === null) return null;
    return `limited to ${n} row${n == 1 ? "" : "s"}`;
}

/**
 * Plain-English summary of a SELECT statement.
 * Deterministic — no LLM call.
 */
exports.explainSql = (sql) => {
    if (typeof sql !== "string" || !sql.trim()) return "(empty query)";

    let ast;
    try {
        ast = parser.astify(sql, OPTS);
    } catch (e) {
        return "(could not parse SQL — explanation unavailable)";
    }
    const node = Array.isArray(ast) ? ast[0] : ast;
    if (!node || node.type !== "select") {
        return `Runs a ${node?.type || "unknown"} statement.`;
    }

    const parts = [];
    parts.push(`Selects ${explainSelectList(node.columns)}`);
    const from = explainFrom(node.from);
    if (from) parts.push(`from ${from}`);
    const where = explainWhere(node.where);
    if (where) parts.push(where);
    const grp = explainGroupBy(node.groupby);
    if (grp) parts.push(grp);
    const order = explainOrderBy(node.orderby);
    if (order) parts.push(order);
    const lim = explainLimit(node.limit);
    if (lim) parts.push(lim);

    return parts.join(", ") + ".";
};
