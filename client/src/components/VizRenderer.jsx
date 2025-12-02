import React from 'react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import TableChart from './charts/TableChart';

const VizRenderer = ({ data, chartType }) => {
    if (!data || data.length === 0) {
        return <div className="p-4 text-center text-gray-400">No data available for visualization.</div>;
    }

    const keys = Object.keys(data[0]);

    let categoryKey = keys.find(k => typeof data[0][k] === 'string');
    
    if (!categoryKey) {
        categoryKey = keys.find(k => /year|month|date|day|time|name|city|category/i.test(k));
    }

    if (!categoryKey) categoryKey = keys[0];

    const valueKey = keys.find(k => 
        typeof data[0][k] === 'number' && k !== categoryKey && !/id$/i.test(k)
    ) || keys.find(k => k !== categoryKey);


    if (chartType === 'line') {
        return (
            <div style={{ height: '500px', width: '100%' }}>
                <LineChart data={data} xKey={categoryKey} yKey={valueKey} />
            </div>
        );
    }

    if (chartType === 'bar') {
        return (
            <div style={{ height: '500px', width: '100%' }}>
                <BarChart data={data} keys={[valueKey]} indexBy={categoryKey} />
            </div>
        );
    }

    if (chartType === 'pie') {
        return (
            <div style={{ height: '500px', width: '100%' }}>
                <PieChart data={data} idKey={categoryKey} valueKey={valueKey} />
            </div>
        );
    }

    // Default to Table
    return (
        <div style={{ maxHeight: '500px', width: '100%', overflow: 'auto' }}>
            <TableChart data={data} />
        </div>
    );
};

export default VizRenderer;