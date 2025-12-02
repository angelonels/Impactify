import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Database, Calendar, Activity } from 'lucide-react';

const Dashboard = () => {
    // Mock data for now
    const [datasets, setDatasets] = useState([
        { id: 1, name: 'Sales_Data_2024.csv', date: '2024-10-24', status: 'Ready', rows: 1200 },
        { id: 2, name: 'Customer_Churn.csv', date: '2024-11-02', status: 'Processing', rows: 850 },
        { id: 3, name: 'Marketing_Campaign.csv', date: '2024-11-15', status: 'Ready', rows: 3400 },
    ]);

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 max-w-7xl mx-auto">
            {/* Header */}
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

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* New Project Card (Alternative Entry) */}
                <Link to="/upload">
                    <motion.div
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.02)' }}
                        className="h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer transition-colors hover:border-black hover:text-black group"
                    >
                        <div className="p-4 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors mb-4">
                            <Plus size={32} />
                        </div>
                        <span className="font-medium">Create New Project</span>
                    </motion.div>
                </Link>

                {/* Dataset Cards */}
                {datasets.map((dataset, index) => (
                    <Link to={`/dataset/${dataset.id}/analyze`} key={dataset.id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                            className="bg-white border border-gray-200 rounded-xl p-6 h-full cursor-pointer hover:border-black transition-colors relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                                    <Database size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    dataset.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {dataset.status}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2 group-hover:underline">{dataset.name}</h3>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{dataset.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Activity size={14} />
                                    <span>{dataset.rows} rows</span>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
