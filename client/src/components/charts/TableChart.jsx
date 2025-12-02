const TableChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    const keys = Object.keys(data[0]);

    return (
        <div style={{ overflowX: 'auto', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                        {keys.map(k => (
                            <th key={k} style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #444' }}>{k}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {keys.map(k => (
                                <td key={k} style={{ padding: '12px' }}>{row[k]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableChart;