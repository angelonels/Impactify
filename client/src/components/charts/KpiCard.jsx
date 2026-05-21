import { inferColumnRoles } from '../../lib/chartShape';

const fmt = (n) => {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    const abs = Math.abs(n);
    if (abs >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return (n / 1e3).toFixed(2) + 'K';
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toFixed(2);
};

export default function KpiCard({ data, valueKey, labelKey }) {
    const roles = inferColumnRoles(data);
    const vk = valueKey || roles.numeric[0];
    const lk = labelKey || roles.categorical[0] || roles.all[0];

    if (data.length === 1) {
        const v = data[0][vk];
        return (
            <div className="kpi-card">
                <div className="kpi-label">{lk ? String(data[0][lk] ?? vk) : vk}</div>
                <div className="kpi-value">{fmt(Number(v))}</div>
            </div>
        );
    }

    // Multi-row: render a grid of KPI tiles
    return (
        <div className="kpi-grid">
            {data.slice(0, 8).map((row, i) => (
                <div className="kpi-card" key={i}>
                    <div className="kpi-label">{lk ? String(row[lk] ?? '') : `Row ${i + 1}`}</div>
                    <div className="kpi-value">{fmt(Number(row[vk]))}</div>
                </div>
            ))}
        </div>
    );
}
