import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutDashboard, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import InputDialog from '../components/InputDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/Dashboards.css';

export default function Dashboards() {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const load = async () => {
        setLoading(true);
        try {
            const j = await api.get('/api/dashboards');
            setBoards(j.dashboards || []);
        } catch {
            setBoards([]);
        } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleCreate = async (name) => {
        setCreating(true);
        try {
            const j = await api.post('/api/dashboards', { name });
            toast.success(`Dashboard "${j.dashboard.name}" created.`);
            setCreateOpen(false);
            navigate(`/dashboards/${j.dashboard.id}`);
        } catch (e) {
            toast.error(e.message || 'Could not create dashboard.');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await api.del(`/api/dashboards/${toDelete.id}`);
            setBoards((b) => b.filter((d) => d.id !== toDelete.id));
            toast.success(`Deleted "${toDelete.name}".`);
            setToDelete(null);
        } catch (e) {
            toast.error(e.message || 'Could not delete dashboard.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="dashboards-page">
            <header className="dashboards-header">
                <div>
                    <h1><LayoutDashboard size={26} /> Dashboards</h1>
                    <p>Composed views built from your pinned insights.</p>
                </div>
                <button className="dashboards-new" onClick={() => setCreateOpen(true)}>
                    <Plus size={16} /> New dashboard
                </button>
            </header>

            {loading && <div className="dashboards-empty">Loading…</div>}
            {!loading && boards.length === 0 && (
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
                        <button
                            className="dashboard-card-delete"
                            onClick={() => setToDelete(b)}
                            title="Delete"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <InputDialog
                open={createOpen}
                onClose={() => !creating && setCreateOpen(false)}
                onConfirm={handleCreate}
                title="New dashboard"
                label="Name"
                placeholder="e.g. Q4 KPIs"
                confirmLabel="Create"
                busy={creating}
                maxLength={80}
            />
            <ConfirmDialog
                open={!!toDelete}
                onClose={() => !deleting && setToDelete(null)}
                onConfirm={handleDelete}
                title="Delete dashboard?"
                message={`"${toDelete?.name || ''}" and its tile layout will be removed. The underlying insights stay safe.`}
                confirmLabel="Delete"
                danger
                busy={deleting}
            />
        </div>
    );
}
