import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Database, Edit2, Check, X } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import '../styles/DataCleaning.css';

const typeColor = (t) => {
    switch ((t || '').toUpperCase()) {
        case 'INTEGER':   return 'type-int';
        case 'FLOAT':     return 'type-float';
        case 'BOOLEAN':   return 'type-bool';
        case 'TIMESTAMP': return 'type-ts';
        default:          return 'type-text';
    }
};

const ColumnCard = ({ datasetId, column, onSaved }) => {
    const [editing, setEditing] = useState(false);
    const [desc, setDesc] = useState(column.description || '');
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    const save = async () => {
        setSaving(true);
        try {
            await api.patch(`/api/dataset/${datasetId}/schema/${column.id}`, { description: desc });
            onSaved(column.id, desc);
            toast.success(`Saved description for "${column.columnName}".`);
            setEditing(false);
        } catch (e) {
            toast.error(e.message || 'Could not save description.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-card"
        >
            <div className="col-card-head">
                <h3>{column.columnName}</h3>
                <span className={`col-type ${typeColor(column.dataType)}`}>
                    {column.dataType}
                </span>
            </div>
            <div className="col-card-body">
                {!editing ? (
                    <p className={column.description ? 'col-desc' : 'col-desc-empty'}>
                        {column.description || 'No description. Add one to help the AI write better queries.'}
                    </p>
                ) : (
                    <textarea
                        className="col-desc-input"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="e.g. total revenue in INR"
                        rows={2}
                        autoFocus
                    />
                )}
            </div>
            <div className="col-card-actions">
                {!editing ? (
                    <button className="col-btn" onClick={() => setEditing(true)}>
                        <Edit2 size={12} /> Edit description
                    </button>
                ) : (
                    <>
                        <button className="col-btn primary" onClick={save} disabled={saving}>
                            <Check size={12} /> {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button className="col-btn" onClick={() => { setDesc(column.description || ''); setEditing(false); }}>
                            <X size={12} /> Cancel
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default function DataCleaning() {
    const { id: datasetId } = useParams();
    const [dataset, setDataset] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/api/dataset/${datasetId}`)
            .then((j) => setDataset(j.dataset))
            .catch((e) => setError(e.message));
    }, [datasetId]);

    const handleSaved = (colId, newDesc) => {
        setDataset((d) => d ? {
            ...d,
            schema: d.schema.map((c) => c.id === colId ? { ...c, description: newDesc } : c),
        } : d);
    };

    if (error) return <div className="cleaning-page"><p className="cleaning-error">⚠ {error}</p></div>;
    if (!dataset) return <div className="cleaning-page"><p>Loading…</p></div>;

    const counts = dataset.schema.reduce((acc, c) => {
        const t = (c.dataType || 'TEXT').toUpperCase();
        acc[t] = (acc[t] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="cleaning-page">
            <header className="cleaning-header">
                <Link to="/dashboard" className="cleaning-back"><ArrowLeft size={14} /> Datasets</Link>
                <h1><Database size={22} /> {dataset.datasetName}</h1>
                <p>
                    Status: <span className={`cleaning-status ${dataset.status === 'READY' ? 'ready' : 'pending'}`}>{dataset.status}</span>
                    {' · '}
                    {dataset.schema.length} columns
                </p>
            </header>

            <section className="cleaning-stats">
                {Object.entries(counts).map(([t, n]) => (
                    <div key={t} className={`stat-pill ${typeColor(t)}`}>
                        <strong>{n}</strong> <span>{t}</span>
                    </div>
                ))}
            </section>

            <section className="cleaning-tip">
                Descriptions you add here are injected into every AI prompt so the assistant
                understands what each column means. Be specific —
                <em> "sales" → total revenue in INR (before tax)</em>.
            </section>

            <section className="cleaning-grid">
                {dataset.schema.map((col) => (
                    <ColumnCard
                        key={col.id}
                        datasetId={datasetId}
                        column={col}
                        onSaved={handleSaved}
                    />
                ))}
            </section>

            <footer className="cleaning-actions">
                <Link to={`/dataset/${datasetId}/analyze`} className="cleaning-cta">
                    Continue to chat →
                </Link>
            </footer>
        </div>
    );
}
