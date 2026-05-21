import { useEffect, useState } from 'react';
import { MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from './ConfirmDialog';
import InputDialog from './InputDialog';

export default function ConversationSidebar({ datasetId, activeId, onSelect, onNew, refreshKey }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toDelete, setToDelete] = useState(null);
    const [busyDelete, setBusyDelete] = useState(false);
    const [renaming, setRenaming] = useState(null);
    const [busyRename, setBusyRename] = useState(false);
    const toast = useToast();

    const load = async () => {
        if (!datasetId) return;
        setLoading(true);
        try {
            const json = await api.get(`/api/conversations?datasetId=${encodeURIComponent(datasetId)}`);
            setItems(json.conversations || []);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [datasetId, refreshKey]);

    const confirmDelete = async () => {
        if (!toDelete) return;
        setBusyDelete(true);
        try {
            await api.del(`/api/conversations/${toDelete.id}`);
            setItems((prev) => prev.filter((c) => c.id !== toDelete.id));
            if (activeId === toDelete.id) onSelect(null);
            toast.success('Conversation deleted.');
            setToDelete(null);
        } catch (e) {
            toast.error(e.message || 'Could not delete conversation.');
        } finally {
            setBusyDelete(false);
        }
    };

    const submitRename = async (title) => {
        if (!renaming) return;
        setBusyRename(true);
        try {
            const j = await api.patch(`/api/conversations/${renaming.id}`, { title });
            setItems((prev) => prev.map((c) => c.id === renaming.id ? { ...c, title: j.conversation.title } : c));
            toast.success('Conversation renamed.');
            setRenaming(null);
        } catch (e) {
            toast.error(e.message || 'Could not rename.');
        } finally {
            setBusyRename(false);
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
                        <button
                            className="conv-item-icon-btn"
                            onClick={(e) => { e.stopPropagation(); setRenaming({ id: c.id, title: c.title }); }}
                            title="Rename"
                        >
                            <Edit2 size={11} />
                        </button>
                        <button
                            className="conv-item-icon-btn danger"
                            onClick={(e) => { e.stopPropagation(); setToDelete(c); }}
                            title="Delete"
                        >
                            <Trash2 size={11} />
                        </button>
                    </div>
                ))}
            </div>

            <ConfirmDialog
                open={!!toDelete}
                onClose={() => !busyDelete && setToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete conversation?"
                message={`"${toDelete?.title || ''}" and all its messages will be removed.`}
                confirmLabel="Delete"
                danger
                busy={busyDelete}
            />
            <InputDialog
                open={!!renaming}
                onClose={() => !busyRename && setRenaming(null)}
                onConfirm={submitRename}
                title="Rename conversation"
                label="Title"
                defaultValue={renaming?.title || ''}
                confirmLabel="Save"
                busy={busyRename}
                maxLength={80}
            />
        </aside>
    );
}
