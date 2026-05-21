import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Sparkles, ExternalLink } from 'lucide-react';
import VizRenderer from '../components/VizRenderer';
import { api } from '../lib/api';
import '../styles/Insights.css';

const InsightCard = ({ insight, onDelete }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        api.post(`/api/insights/${insight.id}/execute`)
            .then((j) => { if (!cancelled) setData(j.data); })
            .catch((e) => { if (!cancelled) setError(e.message); });
        return () => { cancelled = true; };
    }, [insight.id]);

    return (
        <div className="insight-card">
            <div className="insight-card-header">
                <div>
                    <h3>{insight.title}</h3>
                    <span className="insight-card-sub">{insight.dataset?.datasetName}</span>
                </div>
                <div className="insight-card-actions">
                    <Link to={`/dataset/${insight.datasetId}/analyze`} className="insight-card-icon" title="Open in workbench">
                        <ExternalLink size={14} />
                    </Link>
                    <button className="insight-card-icon danger" onClick={() => onDelete(insight.id)} title="Delete">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <div className="insight-card-body">
                {error && <div className="insight-card-error">⚠ {error}</div>}
                {!error && !data && <div className="insight-card-loading">Loading…</div>}
                {!error && data && <VizRenderer data={data} chartType={insight.chartType} />}
            </div>
        </div>
    );
};

export default function Insights() {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const j = await api.get('/api/insights');
            setInsights(j.insights || []);
        } catch (e) {
            setError(e.message);
        } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this insight?')) return;
        await api.del(`/api/insights/${id}`);
        setInsights((prev) => prev.filter((i) => i.id !== id));
    };

    return (
        <div className="insights-page">
            <header className="insights-header">
                <h1><Sparkles size={26} /> Insights</h1>
                <p>Pinned charts from your conversations.</p>
            </header>
            {loading && <div className="insights-empty">Loading…</div>}
            {!loading && error && (
                <div className="insights-empty">
                    <p><AlertCircle size={20} style={{ display: 'inline', marginRight: 8 }} />{error}</p>
                    <p>
                        <button onClick={load} style={{ marginTop: 8, padding: '6px 14px', borderRadius: 8, background: 'rgba(99,102,241,0.18)', color: '#c7d2fe', border: '1px solid rgba(99,102,241,0.3)' }}>
                            Try again
                        </button>
                    </p>
                </div>
            )}
            {!loading && !error && insights.length === 0 && (
                <div className="insights-empty">
                    <p>No saved insights yet.</p>
                    <p>Open a dataset, ask a question, and click the pin icon to save a chart here.</p>
                </div>
            )}
            <div className="insights-grid">
                {insights.map((i) => <InsightCard key={i.id} insight={i} onDelete={handleDelete} />)}
            </div>
        </div>
    );
}
