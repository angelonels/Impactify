// Utilities for converting flat row arrays to chart-specific shapes.

export const isDateLike = (v) => {
    if (v instanceof Date) return true;
    if (typeof v !== 'string') return false;
    const t = Date.parse(v);
    return !Number.isNaN(t);
};

export const inferColumnRoles = (rows) => {
    if (!rows || rows.length === 0) return { numeric: [], categorical: [], temporal: [], all: [] };
    const sample = rows[0];
    const keys = Object.keys(sample).filter((k) => !/^id$/i.test(k));
    const numeric = keys.filter((k) => typeof sample[k] === 'number');
    const temporal = keys.filter((k) => isDateLike(sample[k]) && typeof sample[k] !== 'number');
    const categorical = keys.filter((k) => !numeric.includes(k) && !temporal.includes(k));
    return { numeric, categorical, temporal, all: keys };
};

/** scatter: two numeric columns → [{ id, data: [{x, y}] }] */
export const toScatterShape = (rows, { xKey, yKey, groupKey }) => {
    if (!xKey || !yKey) return [];
    if (!groupKey) {
        return [{
            id: yKey,
            data: rows.map((r) => ({ x: r[xKey], y: r[yKey] })).filter((p) => p.x != null && p.y != null),
        }];
    }
    const groups = new Map();
    for (const r of rows) {
        const g = String(r[groupKey] ?? 'unknown');
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g).push({ x: r[xKey], y: r[yKey] });
    }
    return [...groups.entries()].map(([id, data]) => ({ id, data }));
};

/** heatmap: 2 categorical + 1 numeric → [{ id: rowCat, data: [{x: colCat, y: val}] }] */
export const toHeatmapShape = (rows, { rowKey, colKey, valueKey }) => {
    const grid = new Map();
    const cols = new Set();
    for (const r of rows) {
        const rk = String(r[rowKey] ?? '');
        const ck = String(r[colKey] ?? '');
        cols.add(ck);
        if (!grid.has(rk)) grid.set(rk, new Map());
        grid.get(rk).set(ck, r[valueKey]);
    }
    return [...grid.entries()].map(([id, m]) => ({
        id,
        data: [...cols].map((c) => ({ x: c, y: m.get(c) ?? null })),
    }));
};

/** treemap/sunburst/circle-packing: 1 categorical + 1 numeric → root with children */
export const toHierarchyShape = (rows, { categoryKey, valueKey, rootName = 'root' }) => ({
    name: rootName,
    children: rows.map((r) => ({
        name: String(r[categoryKey] ?? 'unknown'),
        value: Number(r[valueKey]) || 0,
    })),
});

/** funnel: categorical + numeric, top-down order */
export const toFunnelShape = (rows, { categoryKey, valueKey }) =>
    rows.map((r) => ({
        id: String(r[categoryKey] ?? 'unknown'),
        label: String(r[categoryKey] ?? 'unknown'),
        value: Number(r[valueKey]) || 0,
    }));

/** calendar: date + numeric → [{day: 'YYYY-MM-DD', value}] */
export const toCalendarShape = (rows, { dayKey, valueKey }) =>
    rows
        .map((r) => {
            const raw = r[dayKey];
            const d = raw instanceof Date ? raw : new Date(raw);
            if (Number.isNaN(d.getTime())) return null;
            return {
                day: d.toISOString().slice(0, 10),
                value: Number(r[valueKey]) || 0,
            };
        })
        .filter(Boolean);

/** radar: rows where each row has 1 category + N numeric metrics */
export const toRadarShape = (rows, { numericKeys, indexBy }) => ({ data: rows, keys: numericKeys, indexBy });

/** radial-bar: array of categories with one value */
export const toRadialBarShape = (rows, { categoryKey, valueKey }) =>
    rows.map((r) => ({
        id: String(r[categoryKey] ?? 'unknown'),
        data: [{ x: String(r[categoryKey] ?? 'unknown'), y: Number(r[valueKey]) || 0 }],
    }));

/** waffle: total + array of categories with values */
export const toWaffleShape = (rows, { categoryKey, valueKey }) => {
    const data = rows.map((r) => ({
        id: String(r[categoryKey] ?? 'unknown'),
        label: String(r[categoryKey] ?? 'unknown'),
        value: Number(r[valueKey]) || 0,
    }));
    const total = data.reduce((s, d) => s + d.value, 0);
    return { data, total };
};

/** boxplot / swarmplot: rows of {group, value} */
export const toGroupedValueShape = (rows, { groupKey, valueKey }) =>
    rows
        .map((r) => ({ group: String(r[groupKey] ?? 'unknown'), value: Number(r[valueKey]) }))
        .filter((d) => !Number.isNaN(d.value));

/** bump: rank over time — needs a date col, a series col, a value col */
export const toBumpShape = (rows, { xKey, seriesKey, valueKey }) => {
    const seriesMap = new Map();
    for (const r of rows) {
        const s = String(r[seriesKey] ?? 'unknown');
        if (!seriesMap.has(s)) seriesMap.set(s, []);
        seriesMap.get(s).push({ x: String(r[xKey]), y: Number(r[valueKey]) || 0 });
    }
    return [...seriesMap.entries()].map(([id, data]) => ({ id, data }));
};

/** stream: like bump but stacked area; uses keys + indexBy */
export const toStreamShape = (rows, { numericKeys }) => rows.map((r) => {
    const out = {};
    for (const k of numericKeys) out[k] = Number(r[k]) || 0;
    return out;
});
