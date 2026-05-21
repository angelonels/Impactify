import { useEffect, useState } from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

export default function ConversationSidebar({ datasetId, activeId, onSelect, onNew, refreshKey }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        if (!datasetId) return;
        setLoading(true);
        try {
            const json = await api.get(`/api/conversations?datasetId=${encodeURIComponent(datasetId)}`);
            setItems(json.conversations || []);
        } catch (e) {
            console.error('Failed to load conversations:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [datasetId, refreshKey]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm('Delete this conversation?')) return;
        try {
            await api.del(`/api/conversations/${id}`);
            setItems((prev) => prev.filter((c) => c.id !== id));
            if (activeId === id) onSelect(null);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <aside className="conv-sidebar">
            <div className="conv-sidebar-header">
                <button className="conv-new-btn" onClick={onNew}>
                    <Plus size={16} /> New chat
                </button>
            </div>
            <div className="conv-sidebar-list">
                {loading && <div className="conv-sidebar-empty">Loading…</div>}
                {!loading && items.length === 0 && (
                    <div className="conv-sidebar-empty">No conversations yet</div>
                )}
                {items.map((c) => (
                    <div
                        key={c.id}
                        className={`conv-item ${activeId === c.id ? 'active' : ''}`}
                        onClick={() => onSelect(c.id)}
                    >
                        <MessageSquare size={14} className="conv-item-icon" />
                        <div className="conv-item-body">
                            <div className="conv-item-title">{c.title}</div>
                            <div className="conv-item-meta">{c._count?.messages || 0} msgs</div>
                        </div>
                        <button className="conv-item-delete" onClick={(e) => handleDelete(e, c.id)} title="Delete">
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </aside>
    );
}
