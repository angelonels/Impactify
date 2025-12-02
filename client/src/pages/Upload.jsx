import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Check, AlertCircle, Loader2, ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';

const Upload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [query, setQuery] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        const droppedFile = acceptedFiles[0];
        if (!droppedFile) return;

        setIsParsing(true);
        setError(null);

        // Parse CSV
        Papa.parse(droppedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    setError(`Error parsing file: ${results.errors[0].message}`);
                    setIsParsing(false);
                } else {
                    // Simulate API upload delay
                    setTimeout(() => {
                        setIsParsing(false);
                        setUploadSuccess(true);
                        setFile(droppedFile);
                    }, 1500);
                }
            },
            error: (err) => {
                setError(`File reading error: ${err.message}`);
                setIsParsing(false);
            }
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv'],
            'text/plain': ['.csv', '.txt']
        },
        multiple: false,
        noClick: true // Disable click on container, enable only on button
    });

    const handleAnalyze = () => {
        if (!file) return;
        // Navigate to analyze page with dataset ID (mock 123)
        navigate('/dataset/123/analyze');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative bg-white/50">
            {/* Back Button */}
            <Link to="/dashboard" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-black transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
            </Link>

            <div className="w-full max-w-2xl flex flex-col items-center gap-8">
                
                {/* Upload Section */}
                <AnimatePresence mode="wait">
                    {!uploadSuccess ? (
                        <motion.div
                            key="upload-area"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <div 
                                {...getRootProps()} 
                                className={`
                                    relative rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-500
                                    ${isDragActive ? 'bg-gray-100 scale-[1.02]' : 'bg-white shadow-xl border border-gray-100'}
                                    ${error ? 'border-red-200 bg-red-50' : ''}
                                `}
                            >
                                <input {...getInputProps()} />

                                {isParsing ? (
                                    <div className="flex flex-col items-center py-8">
                                        <div className="relative w-16 h-16 mb-6">
                                            <motion.div
                                                className="absolute inset-0 border-4 border-gray-200 rounded-full"
                                            />
                                            <motion.div
                                                className="absolute inset-0 border-4 border-black rounded-full border-t-transparent"
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            />
                                        </div>
                                        <p className="text-lg font-medium text-gray-600">Processing your data...</p>
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col items-center text-center py-4">
                                        <AlertCircle size={40} className="text-red-400 mb-4" />
                                        <p className="text-red-600 mb-6">{error}</p>
                                        <button 
                                            onClick={open}
                                            className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-full font-medium hover:bg-red-50 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center py-8">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-400">
                                            <UploadCloud size={32} />
                                        </div>
                                        <button 
                                            onClick={open}
                                            className="px-8 py-3 bg-black text-white rounded-full font-medium hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl mb-4"
                                        >
                                            Upload Dataset
                                        </button>
                                        <p className="text-sm text-gray-400">Supports CSV, Excel (Max 50MB)</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-area"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                <Check size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{file?.name}</h3>
                                <p className="text-sm text-gray-500">Ready for analysis</p>
                            </div>
                            <button 
                                onClick={() => setUploadSuccess(false)}
                                className="text-sm text-gray-400 hover:text-black underline"
                            >
                                Change
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI Query Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                >
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative bg-white rounded-2xl p-1">
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask a question about your data (e.g., 'Show me the sales trend over time')..."
                                className="w-full h-32 p-6 bg-transparent border-none focus:ring-0 text-lg resize-none placeholder-gray-300 text-gray-900"
                            />
                            <div className="flex justify-between items-center px-6 pb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                    <Sparkles size={14} />
                                    <span>AI-Powered Analysis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Analyze Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleAnalyze}
                    disabled={!uploadSuccess}
                    className={`
                        group relative w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300
                        ${uploadSuccess 
                            ? 'bg-black text-white hover:shadow-2xl hover:scale-[1.02] cursor-pointer' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    <span>Start Analysis</span>
                    <ArrowRight size={20} className={`transition-transform duration-300 ${uploadSuccess ? 'group-hover:translate-x-1' : ''}`} />
                </motion.button>

            </div>
        </div>
    );
};

export default Upload;
