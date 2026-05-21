import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Database, Calendar, Activity, AlertCircle, Loader2, Trash2, Edit2, Sliders } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import InputDialog from '../components/InputDialog';
import ConfirmDialog from '../components/ConfirmDialog';

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

    const statusClass = (status) => {
        switch ((status || '').toUpperCase()) {
            case 'READY':      return 'bg-green-100 text-green-800';
            case 'ERROR':      return 'bg-red-100 text-red-800';
            case 'PROFILING':
            case 'CLEANING':
            case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
            default:           return 'bg-gray-100 text-gray-700';
        }
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
                                transition={{ delay: index * 0.05 }}
                                whileHover={ready ? { y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' } : {}}
                                className={`rounded-xl p-6 h-full transition-colors relative overflow-hidden group ${ready ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}
                                style={{
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--fg)',
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 rounded-lg transition-colors" style={{ background: 'var(--surface-soft)' }}>
                                        <Database size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(dataset.status)}`}>
                                        {dataset.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:underline truncate">
                                    {dataset.datasetName}
                                </h3>

                                <div className="flex items-center gap-4 text-sm mt-4" style={{ opacity: 0.6 }}>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{formatDate(dataset.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Activity size={14} />
                                        <span className="truncate">{dataset.tableName}</span>
                                    </div>
                                </div>

                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        to={`/dataset/${dataset.id}/clean`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1.5 rounded backdrop-blur"
                                        style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.08)', color: '#111' }}
                                        title="Edit schema"
                                    >
                                        <Sliders size={12} />
                                    </Link>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRenaming({ id: dataset.id, datasetName: dataset.datasetName }); }}
                                        className="p-1.5 rounded backdrop-blur"
                                        style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.08)', color: '#111' }}
                                        title="Rename"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleting({ id: dataset.id, datasetName: dataset.datasetName }); }}
                                        className="p-1.5 rounded backdrop-blur"
                                        style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.08)', color: '#dc2626' }}
                                        title="Delete"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        );

                        return ready ? (
                            <Link to={`/dataset/${dataset.id}/analyze`} key={dataset.id}>{card}</Link>
                        ) : (
                            <div key={dataset.id}>{card}</div>
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
