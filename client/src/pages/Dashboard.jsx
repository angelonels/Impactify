import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Database, Calendar, Activity, AlertCircle, Loader2, Trash2, Edit2, Sliders } from 'lucide-react';
import { api } from '../lib/api';

const Dashboard = () => {
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Your Projects</h1>
                    <p className="text-gray-500">Manage and analyze your datasets.</p>
                </div>
                <Link to="/upload">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus size={20} />
                        New Project
                    </motion.button>
                </Link>
            </div>

            {loading && (
                <div className="flex items-center gap-2 text-gray-500 py-8">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Loading your datasets…</span>
                </div>
            )}

            {error && !loading && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-8">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {!loading && (
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

                        const handleRename = async (e) => {
                            e.preventDefault(); e.stopPropagation();
                            const name = prompt('Rename dataset:', dataset.datasetName);
                            if (!name || name === dataset.datasetName) return;
                            const j = await api.patch(`/api/dataset/${dataset.id}`, { datasetName: name });
                            setDatasets((ds) => ds.map((d) => d.id === dataset.id ? { ...d, datasetName: j.dataset.datasetName } : d));
                        };
                        const handleDelete = async (e) => {
                            e.preventDefault(); e.stopPropagation();
                            if (!confirm(`Delete "${dataset.datasetName}"? This is permanent.`)) return;
                            await api.del(`/api/dataset/${dataset.id}`);
                            setDatasets((ds) => ds.filter((d) => d.id !== dataset.id));
                        };

                        const card = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={ready ? { y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' } : {}}
                                className={`bg-white border border-gray-200 rounded-xl p-6 h-full transition-colors relative overflow-hidden group ${ready ? 'cursor-pointer hover:border-black' : 'cursor-not-allowed opacity-75'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                                        <Database size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(dataset.status)}`}>
                                        {dataset.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:underline truncate">
                                    {dataset.datasetName}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
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
                                    <Link to={`/dataset/${dataset.id}/clean`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded bg-white/80 backdrop-blur border border-gray-200 hover:bg-gray-50" title="Schema">
                                        <Sliders size={12} />
                                    </Link>
                                    <button onClick={handleRename} className="p-1.5 rounded bg-white/80 backdrop-blur border border-gray-200 hover:bg-gray-50" title="Rename">
                                        <Edit2 size={12} />
                                    </button>
                                    <button onClick={handleDelete} className="p-1.5 rounded bg-white/80 backdrop-blur border border-gray-200 text-red-500 hover:bg-red-50" title="Delete">
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
                        <div className="md:col-span-2 lg:col-span-3 text-center text-gray-400 py-12">
                            No datasets yet. Upload one to get started.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
