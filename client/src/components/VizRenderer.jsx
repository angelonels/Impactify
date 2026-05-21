import React, { useState, useMemo } from 'react';
import { chartRegistry, getChart, chartGroups } from './charts/registry';
import { inferColumnRoles } from '../lib/chartShape';

const coerceRow = (row) => {
    const result = {};
    for (const [key, value] of Object.entries(row)) {
        if (value === null || value === undefined) result[key] = value;
        else if (typeof value === 'string' && value.trim() !== '' && !isNaN(value)) result[key] = Number(value);
        else result[key] = value;
    }
    return result;
};

const CHART_HEIGHT = 500;

const EmptyState = ({ message }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 1rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', gap: '0.75rem',
    }}>
        <p style={{ margin: 0, fontSize: '0.95rem' }}>
            {message || 'No data available for this query.'}
        </p>
    </div>
);

const ChartTypeSwitcher = ({ active, roles, onChange }) => {
    const grouped = {};
    for (const [type, meta] of Object.entries(chartRegistry)) {
        const enabled = !meta.requires || meta.requires(roles);
        (grouped[meta.group] = grouped[meta.group] || []).push({ type, label: meta.label, enabled });
    }
    return (
        <div className="viz-switcher">
            {Object.entries(grouped).map(([groupKey, items]) => (
                <div key={groupKey} className="viz-switcher-group">
                    <span className="viz-switcher-group-label">{chartGroups[groupKey] || groupKey}</span>
                    <div className="viz-switcher-row">
                        {items.map(({ type, label, enabled }) => (
                            <button
                                key={type}
                                type="button"
                                disabled={!enabled}
                                className={`viz-switcher-chip ${active === type ? 'active' : ''}`}
                                title={enabled ? type : `${type} (data shape unsuitable)`}
                                onClick={() => enabled && onChange(type)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const VizRenderer = ({ data, chartType, emptyMessage }) => {
    const coercedData = useMemo(() => (data || []).map(coerceRow), [data]);
    const roles = useMemo(() => inferColumnRoles(coercedData), [coercedData]);

    const initial = chartType && chartRegistry[chartType] ? chartType : 'table';
    const [active, setActive] = useState(initial);

    React.useEffect(() => { setActive(initial); }, [initial]);

    if (!data || data.length === 0) {
        return <EmptyState message={emptyMessage || 'No data available for this query.'} />;
    }

    const meta = getChart(active);
    const Component = meta.component;

    // Filter null/empty category rows for chart types (table keeps them)
    const isChart = active !== 'table';
    const cleaned = isChart
        ? coercedData.filter((row) => {
              const cat = roles.categorical[0];
              if (!cat) return true;
              const v = row[cat];
              return v !== null && v !== undefined && String(v).trim() !== '';
          })
        : coercedData;

    return (
        <div className="viz-renderer">
            <ChartTypeSwitcher active={active} roles={roles} onChange={setActive} />
            <div style={{ height: active === 'table' ? 'auto' : `${CHART_HEIGHT}px`, width: '100%' }}>
                <Component
                    data={cleaned}
                    {...(active === 'bar' && { keys: roles.numeric.length ? roles.numeric : [roles.all[1]], indexBy: roles.categorical[0] || roles.all[0] })}
                    {...((active === 'line' || active === 'area') && { xKey: roles.temporal[0] || roles.categorical[0] || roles.all[0], yKey: roles.numeric[0] || roles.all[1] })}
                    {...(active === 'pie' || active === 'donut' ? { idKey: roles.categorical[0] || roles.all[0], valueKey: roles.numeric[0] || roles.all[1] } : {})}
                />
            </div>
        </div>
    );
};

export default VizRenderer;
