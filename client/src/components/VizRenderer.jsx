import React from 'react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import TableChart from './charts/TableChart';

/**
 * Client-side defense-in-depth: ensures every value that looks like a number
 * is an actual JS number, regardless of what the backend sends.
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
 * Infers category (string) and value (number) keys from the first data row.
 * Skips columns named 'id' to avoid using primary keys as chart axes.
 */
const inferKeys = (row) => {
    const keys = Object.keys(row);
    const skip = (k) => /^id$/i.test(k);

    const categoryKey = keys.find(k => !skip(k) && typeof row[k] === 'string')
        || keys.find(k => !skip(k) && /year|month|date|day|time|name|city|category/i.test(k))
        || keys.find(k => !skip(k))
        || keys[0];

    const valueKeys = keys.filter(k => !skip(k) && typeof row[k] === 'number' && k !== categoryKey);
    const primaryValueKey = valueKeys[0] || keys.find(k => k !== categoryKey) || keys[0];

    return { categoryKey, valueKeys, primaryValueKey };
};

const CHART_HEIGHT = 500;

const ChartWrapper = ({ children }) => (
    <div style={{ height: `${CHART_HEIGHT}px`, width: '100%' }}>
        {children}
    </div>
);

const VizRenderer = ({ data, chartType }) => {
    if (!data || data.length === 0) {
        return (
            <div className="viz-empty-state">
                No data available for visualization.
            </div>
        );
    }

    // Coerce all rows to ensure numeric values are actual numbers
    const coercedData = data.map(coerceRow);
    const { categoryKey, valueKeys, primaryValueKey } = inferKeys(coercedData[0]);

    switch (chartType) {
        case 'bar':
            return (
                <ChartWrapper>
                    <BarChart
                        data={coercedData}
                        keys={valueKeys.length > 0 ? valueKeys : [primaryValueKey]}
                        indexBy={categoryKey}
                    />
                </ChartWrapper>
            );

        case 'line':
            return (
                <ChartWrapper>
                    <LineChart
                        data={coercedData}
                        xKey={categoryKey}
                        yKey={primaryValueKey}
                    />
                </ChartWrapper>
            );

        case 'pie':
            return (
                <ChartWrapper>
                    <PieChart
                        data={coercedData}
                        idKey={categoryKey}
                        valueKey={primaryValueKey}
                    />
                </ChartWrapper>
            );

        case 'table':
        default:
            return (
                <div style={{ maxHeight: `${CHART_HEIGHT}px`, width: '100%', overflow: 'auto' }}>
                    <TableChart data={coercedData} />
                </div>
            );
    }
};

export default VizRenderer;