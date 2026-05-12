import React from 'react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import TableChart from './charts/TableChart';

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Ensures every value that looks like a number is an actual JS number.
 * node-postgres returns bigint / numeric / aggregate results as strings.
 */
const coerceRow = (row) => {
    const result = {};
    for (const [key, value] of Object.entries(row)) {
        if (value === null || value === undefined) {
            result[key] = value;
        } else if (typeof value === 'string' && value.trim() !== '' && !isNaN(value)) {
            result[key] = Number(value);
        } else {
            result[key] = value;
        }
    }
    return result;
};

/**
 * Infers which column should be the category axis (string) and which are
 * value axes (numbers). Skips the auto-generated 'id' primary key column.
 */
const inferKeys = (row) => {
    const keys = Object.keys(row);
    const skip  = (k) => /^id$/i.test(k);

    const categoryKey =
        keys.find(k => !skip(k) && typeof row[k] === 'string') ||
        keys.find(k => !skip(k) && /year|month|date|day|time|name|city|category/i.test(k)) ||
        keys.find(k => !skip(k)) ||
        keys[0];

    const valueKeys = keys.filter(
        k => !skip(k) && typeof row[k] === 'number' && k !== categoryKey
    );
    const primaryValueKey =
        valueKeys[0] || keys.find(k => k !== categoryKey) || keys[0];

    return { categoryKey, valueKeys, primaryValueKey };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const CHART_HEIGHT = 500;

const ChartWrapper = ({ children }) => (
    <div style={{ height: `${CHART_HEIGHT}px`, width: '100%' }}>
        {children}
    </div>
);

const EmptyState = ({ message }) => (
    <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '3rem 1rem',
        color:          'rgba(255,255,255,0.4)',
        textAlign:      'center',
        gap:            '0.75rem',
    }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35M11 8v3m0 0v3m0-3H8m3 0h3"/>
        </svg>
        <p style={{ margin: 0, fontSize: '0.95rem' }}>
            {message || 'No data available for this query.'}
        </p>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const VizRenderer = ({ data, chartType, emptyMessage }) => {
    if (!data || data.length === 0) {
        return <EmptyState message={emptyMessage || 'No data available for this query.'} />;
    }

    // Ensure all numeric-looking strings become real JS numbers
    const coercedData = data.map(coerceRow);
    const { categoryKey, valueKeys, primaryValueKey } = inferKeys(coercedData[0]);

    // Filter out rows where the category axis value is null / empty.
    // These produce a literal "null" label on charts and destroy the scale.
    const isChart  = chartType !== 'table';
    const chartData = isChart
        ? coercedData.filter(row => {
            const v = row[categoryKey];
            return v !== null && v !== undefined && String(v).trim() !== '';
        })
        : coercedData;

    // If filtering removed everything, show a friendly message
    if (chartData.length === 0) {
        return (
            <EmptyState message="The key column has no usable values — showing raw data below." />
        );
    }

    switch (chartType) {
        case 'bar':
            return (
                <ChartWrapper>
                    <BarChart
                        data={chartData}
                        keys={valueKeys.length > 0 ? valueKeys : [primaryValueKey]}
                        indexBy={categoryKey}
                    />
                </ChartWrapper>
            );

        case 'line':
            return (
                <ChartWrapper>
                    <LineChart
                        data={chartData}
                        xKey={categoryKey}
                        yKey={primaryValueKey}
                    />
                </ChartWrapper>
            );

        case 'pie':
            return (
                <ChartWrapper>
                    <PieChart
                        data={chartData}
                        idKey={categoryKey}
                        valueKey={primaryValueKey}
                    />
                </ChartWrapper>
            );

        case 'table':
        default:
            return (
                <div style={{ maxHeight: `${CHART_HEIGHT}px`, width: '100%', overflow: 'auto' }}>
                    <TableChart data={chartData} />
                </div>
            );
    }
};

export default VizRenderer;