import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import { Plus, ArrowLeft, X } from 'lucide-react';
import VizRenderer from '../components/VizRenderer';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import 'react-grid-layout/css/styles.css';
import '../styles/Dashboards.css';

const TileChart = ({ savedInsightId, chartType }) => {
    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    useEffect(() => {
        let cancelled = false;
        api.post(`/api/insights/${savedInsightId}/execute`)
            .then((j) => { if (!cancelled) setData(j.data); })
            .catch((e) => { if (!cancelled) setErr(e.message); });
        return () => { cancelled = true; };
    }, [savedInsightId]);
    if (err) return <div className="dash-tile-error">⚠ {err}</div>;
    if (!data) return <div className="dash-tile-loading">Loading…</div>;
    return <VizRenderer data={data} chartType={chartType} />;
};

export default function DashboardView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [insights, setInsights] = useState([]);
    const [picker, setPicker] = useState(false);
    const [adding, setAdding] = useState(false);
    const [removingTile, setRemovingTile] = useState(null);
    const [busyRemove, setBusyRemove] = useState(false);
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth - 80 : 1200);
    const toast = useToast();

    const load = useCallback(async () => {
        try {
            const [d, i] = await Promise.all([
                api.get(`/api/dashboards/${id}`),
                api.get('/api/insights'),
            ]);
            setDashboard(d.dashboard);
            setInsights(i.insights || []);
        } catch (e) {
            toast.error(e.message || 'Could not load dashboard.');
        }
    }, [id, toast]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth - 80);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleAdd = async (insightId) => {
        setAdding(true);
        try {
            await api.post(`/api/dashboards/${id}/items`, { savedInsightId: insightId, w: 6, h: 4 });
            setPicker(false);
            toast.success('Tile added.');
            await load();
        } catch (e) {
            toast.error(e.message || 'Could not add tile.');
        } finally {
            setAdding(false);
        }
    };

    const confirmRemoveTile = async () => {
        if (!removingTile) return;
        setBusyRemove(true);
        try {
            await api.del(`/api/dashboards/${id}/items/${removingTile.id}`);
            toast.success('Tile removed.');
            setRemovingTile(null);
            await load();
        } catch (e) {
            toast.error(e.message || 'Could not remove tile.');
        } finally {
            setBusyRemove(false);
        }
    };

    const onLayoutChange = async (layout) => {
        if (!dashboard) return;
        const items = layout.map((l) => ({ id: l.i, x: l.x, y: l.y, w: l.w, h: l.h }));
        try {
            await api.patch(`/api/dashboards/${id}/layout`, { items });
        } catch (e) {
            toast.error('Layout couldn\'t save. We\'ll keep trying.');
        }
    };

    if (!dashboard) return <div className="dashboards-page"><p className="dashboard-view-muted">Loading…</p></div>;

    const layout = dashboard.items.map((it) => ({
        i: it.id, x: it.x, y: it.y, w: it.w, h: it.h, minW: 3, minH: 3,
    }));

    return (
        <div className="dashboard-view-page">
            <header className="dashboard-view-header">
                <Link to="/dashboards" className="dashboard-back"><ArrowLeft size={16} /> Back</Link>
                <h1>{dashboard.name}</h1>
                <button className="dashboards-new" onClick={() => setPicker(true)}><Plus size={16} /> Add insight</button>
            </header>

            {dashboard.items.length === 0 ? (
                <div className="dashboards-empty">
                    <p>Empty dashboard. Click "Add insight" to start composing.</p>
                </div>
            ) : (
                <GridLayout
                    className="dashboard-grid"
                    layout={layout}
                    cols={12}
                    rowHeight={60}
                    width={width}
                    onDragStop={onLayoutChange}
                    onResizeStop={onLayoutChange}
                    draggableHandle=".dash-tile-handle"
                >
                    {dashboard.items.map((it) => (
                        <div key={it.id} className="dash-tile">
                            <div className="dash-tile-header">
                                <span className="dash-tile-handle">⋮⋮ {it.savedInsight.title}</span>
                                <button onClick={() => setRemovingTile(it)} className="dash-tile-remove" title="Remove">
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="dash-tile-body">
                                <TileChart savedInsightId={it.savedInsightId} chartType={it.savedInsight.chartType} />
                            </div>
                        </div>
                    ))}
                </GridLayout>
            )}

            {picker && (
                <div className="picker-overlay" onClick={() => !adding && setPicker(false)}>
                    <div className="picker-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Pick an insight</h3>
                        {insights.length === 0 ? (
                            <p className="dashboard-view-muted">No insights to add. Pin one from the workbench first.</p>
                        ) : (
                            <div className="picker-list">
                                {insights.map((i) => (
                                    <button
                                        className="picker-item"
                                        key={i.id}
                                        onClick={() => handleAdd(i.id)}
                                        disabled={adding}
                                    >
                                        <div>
                                            <strong>{i.title}</strong>
                                            <div className="picker-meta">{i.chartType} · {i.dataset?.datasetName}</div>
                                        </div>
                                        <Plus size={14} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={!!removingTile}
                onClose={() => !busyRemove && setRemovingTile(null)}
                onConfirm={confirmRemoveTile}
                title="Remove tile?"
                message={`"${removingTile?.savedInsight?.title || ''}" will be removed from this dashboard. The insight stays pinned.`}
                confirmLabel="Remove"
                danger
                busy={busyRemove}
            />
        </div>
    );
}
