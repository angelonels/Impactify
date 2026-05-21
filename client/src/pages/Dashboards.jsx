import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutDashboard, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import '../styles/Dashboards.css';

export default function Dashboards() {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const j = await api.get('/api/dashboards');
            setBoards(j.dashboards || []);
        } catch (e) {
            setError(e.message);
        } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleCreate = async () => {
        const name = prompt('New dashboard name:');
        if (!name) return;
        const j = await api.post('/api/dashboards', { name });
        navigate(`/dashboards/${j.dashboard.id}`);
    };
    const handleDelete = async (id) => {
        if (!confirm('Delete this dashboard?')) return;
        await api.del(`/api/dashboards/${id}`);
        setBoards((b) => b.filter((d) => d.id !== id));
    };

    return (
        <div className="dashboards-page">
            <header className="dashboards-header">
                <div>
                    <h1><LayoutDashboard size={26} /> Dashboards</h1>
                    <p>Composed views built from your pinned insights.</p>
                </div>
                <button className="dashboards-new" onClick={handleCreate}>
                    <Plus size={16} /> New dashboard
                </button>
            </header>

            {loading && <div className="dashboards-empty">Loading…</div>}
            {!loading && error && (
                <div className="dashboards-empty">
                    <p>{error}</p>
                    <p>
                        <button onClick={load} style={{ marginTop: 8, padding: '6px 14px', borderRadius: 8, background: 'rgba(99,102,241,0.18)', color: '#c7d2fe', border: '1px solid rgba(99,102,241,0.3)' }}>
                            Try again
                        </button>
                    </p>
                </div>
            )}
            {!loading && !error && boards.length === 0 && (
                <div className="dashboards-empty">
                    <p>No dashboards yet. Create one and drop pinned insights into it.</p>
                </div>
            )}

            <div className="dashboards-grid">
                {boards.map((b) => (
                    <div className="dashboard-card" key={b.id}>
                        <Link to={`/dashboards/${b.id}`} className="dashboard-card-body">
                            <h3>{b.name}</h3>
                            <span className="dashboard-card-meta">{b._count?.items || 0} tiles</span>
                        </Link>
                        <button className="dashboard-card-delete" onClick={() => handleDelete(b.id)} title="Delete">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
