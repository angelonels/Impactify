import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Sparkles, ExternalLink } from 'lucide-react';
import VizRenderer from '../components/VizRenderer';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
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
                    <button className="insight-card-icon danger" onClick={onDelete} title="Delete">
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
    const [toDelete, setToDelete] = useState(null);
    const [busy, setBusy] = useState(false);
    const toast = useToast();

    const load = async () => {
        setLoading(true);
        try {
            const j = await api.get('/api/insights');
            setInsights(j.insights || []);
        } catch {
            setInsights([]);
        } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const confirmDelete = async () => {
        if (!toDelete) return;
        setBusy(true);
        try {
            await api.del(`/api/insights/${toDelete.id}`);
            setInsights((prev) => prev.filter((i) => i.id !== toDelete.id));
            toast.success('Insight deleted.');
            setToDelete(null);
        } catch (e) {
            toast.error(e.message || 'Could not delete insight.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="insights-page">
            <header className="insights-header">
                <h1><Sparkles size={26} /> Insights</h1>
                <p>Pinned charts from your conversations.</p>
            </header>
            {loading && <div className="insights-empty">Loading…</div>}
            {!loading && insights.length === 0 && (
                <div className="insights-empty">
                    <p>No saved insights yet.</p>
                    <p>Open a dataset, ask a question, and click the pin icon to save a chart here.</p>
                </div>
            )}
            <div className="insights-grid">
                {insights.map((i) => (
                    <InsightCard
                        key={i.id}
                        insight={i}
                        onDelete={() => setToDelete(i)}
                    />
                ))}
            </div>

            <ConfirmDialog
                open={!!toDelete}
                onClose={() => !busy && setToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete insight?"
                message={`"${toDelete?.title || ''}" will be removed from your insights. Dashboard tiles using it will be removed too.`}
                confirmLabel="Delete"
                danger
                busy={busy}
            />
        </div>
    );
}
