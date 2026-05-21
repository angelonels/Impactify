// Build a human-meaningful title from a dataset's schema.
// Deterministic, no LLM — picks the most plausible metric + dimension
// from column names and types and renders e.g. "Sales by City".

const METRIC_HINT = /^(sales|revenue|amount|total|count|units?|price|cost|profit|spend|gmv|users?|signups?|orders?|qty|quantity|value|score|rating|sessions?|views?|clicks?|impressions?|conversions?|income|expense|balance)$/i;
const DIM_HINT = /(city|country|state|region|category|product|customer|segment|store|channel|brand|team|user|member|department|industry|source|status|name|title|tag)/i;
const TIME_TYPES = new Set(['TIMESTAMP', 'DATE', 'DATETIME']);

const titleCase = (s) =>
    String(s || '')
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

/**
 * @param {Array<{columnName, dataType}>} schema
 * @returns {string|null}
 */
export function titleFromSchema(schema) {
    if (!Array.isArray(schema) || schema.length === 0) return null;
    const numeric = schema.filter((c) => ['INTEGER', 'FLOAT'].includes((c.dataType || '').toUpperCase()));
    const text    = schema.filter((c) => (c.dataType || '').toUpperCase() === 'TEXT');
    const time    = schema.filter((c) => TIME_TYPES.has((c.dataType || '').toUpperCase()));

    const metric = numeric.find((c) => METRIC_HINT.test(c.columnName)) || numeric[0];
    const dim    = text.find((c) => DIM_HINT.test(c.columnName)) || text[0];

    if (!metric && !dim && time.length === 0) return null;

    if (metric && time.length > 0) return `${titleCase(metric.columnName)} Over Time`;
    if (metric && dim)             return `${titleCase(metric.columnName)} by ${titleCase(dim.columnName)}`;
    if (metric)                    return `${titleCase(metric.columnName)} Dataset`;
    if (dim && time.length > 0)    return `${titleCase(dim.columnName)} Over Time`;
    if (dim)                       return `${titleCase(dim.columnName)} Dataset`;
    if (time.length > 0)           return 'Time Series Dataset';
    return null;
}

/**
 * Strip a CSV/XLSX extension and title-case underscores/hyphens.
 *  "sales_sample.csv" → "Sales Sample"
 */
export function titleFromFilename(filename) {
    if (!filename) return 'Untitled dataset';
    let name = String(filename).trim().replace(/\.(csv|xlsx|xls|tsv|json|txt)$/i, '');
    const messy = /[_\-.]|^[a-z]/.test(name) && !/\s/.test(name);
    if (messy) {
        name = name.replace(/[_\-.]+/g, ' ').replace(/\s+/g, ' ').trim();
        name = titleCase(name);
    }
    return name || 'Untitled dataset';
}

/**
 * Final display name resolver.
 *  - If user explicitly renamed (datasetName already pretty / non-filename) → use it.
 *  - Else if schema has signal → derive from schema ("Sales by City").
 *  - Else fall back to filename pretty.
 */
export function resolveDisplayName(dataset) {
    const raw = (dataset.datasetName || '').trim();
    const isFilename = /\.(csv|xlsx|xls|tsv|json|txt)$/i.test(raw);
    if (raw && !isFilename) return raw; // user-given name wins
    const fromSchema = titleFromSchema(dataset.schema);
    if (fromSchema) return fromSchema;
    return titleFromFilename(raw);
}
