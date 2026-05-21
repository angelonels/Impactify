import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Database, Calendar, Activity, AlertCircle, Loader2, Trash2, Edit2, Sliders } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import InputDialog from '../components/InputDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { resolveDisplayName } from '../lib/datasetTitle';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [renaming, setRenaming] = useState(null);   // { id, datasetName }
    const [busyRename, setBusyRename] = useState(false);
    const [deleting, setDeleting] = useState(null);   // { id, datasetName }
    const [busyDelete, setBusyDelete] = useState(false);
    const toast = useToast();

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const json = await api.get('/api/dataset/list');
                if (!cancelled) setDatasets(Array.isArray(json.datasets) ? json.datasets : []);
            } catch (e) {
                if (!cancelled) setError(e.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    const formatDate = (iso) => {
        if (!iso) return '';
        try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
    };

    const submitRename = async (newName) => {
        if (!renaming || newName === renaming.datasetName) {
            setRenaming(null);
            return;
        }
        setBusyRename(true);
        try {
            const j = await api.patch(`/api/dataset/${renaming.id}`, { datasetName: newName });
            setDatasets((ds) => ds.map((d) => d.id === renaming.id ? { ...d, datasetName: j.dataset.datasetName } : d));
            toast.success('Dataset renamed.');
            setRenaming(null);
        } catch (e) {
            toast.error(e.message || 'Could not rename dataset.');
        } finally {
            setBusyRename(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleting) return;
        setBusyDelete(true);
        try {
            await api.del(`/api/dataset/${deleting.id}`);
            setDatasets((ds) => ds.filter((d) => d.id !== deleting.id));
            toast.success(`Deleted "${deleting.datasetName}".`);
            setDeleting(null);
        } catch (e) {
            toast.error(e.message || 'Could not delete dataset.');
        } finally {
            setBusyDelete(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 max-w-7xl mx-auto" style={{ color: 'var(--fg)' }}>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Your Projects</h1>
                    <p style={{ color: 'var(--fg)', opacity: 0.6 }}>Manage and analyze your datasets.</p>
                </div>
                <Link to="/upload">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }}
                    >
                        <Plus size={20} />
                        New Project
                    </motion.button>
                </Link>
            </div>

            {loading && (
                <div className="flex items-center gap-2 py-8" style={{ color: 'var(--fg)', opacity: 0.6 }}>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Loading your datasets…</span>
                </div>
            )}

            {error && !loading && (
                <div
                    className="flex flex-col items-center justify-center text-center gap-3 p-10 rounded-xl mb-8"
                    style={{
                        background: 'var(--surface-soft)',
                        border: '1px solid var(--border)',
                        color: 'var(--fg)',
                    }}
                >
                    <AlertCircle size={28} className="opacity-60" />
                    <h3 className="text-lg font-semibold">We couldn't load your datasets.</h3>
                    <p className="text-sm opacity-70 max-w-md">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ background: 'rgba(99,102,241,0.18)', color: '#c7d2fe', border: '1px solid rgba(99,102,241,0.3)' }}
                    >
                        Try again
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link to="/upload">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="h-full min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group"
                            style={{
                                borderColor: 'var(--border)',
                                color: 'var(--fg)',
                            }}
                        >
                            <div className="p-4 rounded-full mb-4 transition-colors" style={{ background: 'var(--surface-soft)' }}>
                                <Plus size={32} />
                            </div>
                            <span className="font-medium">Create New Project</span>
                        </motion.div>
                    </Link>

                    {datasets.map((dataset, index) => {
                        const ready = (dataset.status || '').toUpperCase() === 'READY';

                        const card = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                whileHover={ready ? { y: -4 } : {}}
                                className={`dataset-card ${ready ? '' : 'is-pending'}`}
                            >
                                <div className="dataset-card-top">
                                    <div className="dataset-card-icon">
                                        <Database size={22} />
                                    </div>
                                    <span className={`dataset-status status-${(dataset.status || 'unknown').toLowerCase()}`}>
                                        {dataset.status}
                                    </span>
                                </div>

                                <h3 className="dataset-card-title">{resolveDisplayName(dataset)}</h3>
                                <p className="dataset-card-filename">{dataset.datasetName}</p>

                                <div className="dataset-card-meta">
                                    <span><Calendar size={13} /> {formatDate(dataset.createdAt)}</span>
                                </div>

                                <div className="dataset-card-actions">
                                    <Link
                                        to={`/dataset/${dataset.id}/clean`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="dataset-action"
                                        title="Edit schema"
                                        aria-label="Edit schema"
                                    >
                                        <Sliders size={14} />
                                    </Link>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRenaming({ id: dataset.id, datasetName: dataset.datasetName }); }}
                                        className="dataset-action"
                                        title="Rename"
                                        aria-label="Rename"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleting({ id: dataset.id, datasetName: dataset.datasetName }); }}
                                        className="dataset-action danger"
                                        title="Delete"
                                        aria-label="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        );

                        return ready ? (
                            <Link to={`/dataset/${dataset.id}/analyze`} key={dataset.id} className="dataset-card-link">{card}</Link>
                        ) : (
                            <div key={dataset.id} className="dataset-card-link">{card}</div>
                        );
                    })}

                    {datasets.length === 0 && !error && (
                        <div className="md:col-span-2 lg:col-span-3 text-center py-12" style={{ color: 'var(--fg)', opacity: 0.5 }}>
                            No datasets yet. Upload one to get started.
                        </div>
                    )}
                </div>
            )}

            <InputDialog
                open={!!renaming}
                onClose={() => !busyRename && setRenaming(null)}
                onConfirm={submitRename}
                title="Rename dataset"
                label="New name"
                defaultValue={renaming?.datasetName || ''}
                confirmLabel="Save"
                busy={busyRename}
                maxLength={120}
            />
            <ConfirmDialog
                open={!!deleting}
                onClose={() => !busyDelete && setDeleting(null)}
                onConfirm={confirmDelete}
                title="Delete dataset?"
                message={`"${deleting?.datasetName || ''}" and its underlying data table will be permanently removed.`}
                confirmLabel="Delete"
                danger
                busy={busyDelete}
            />
        </div>
    );
};

export default Dashboard;
