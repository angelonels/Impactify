import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Check, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const Upload = () => {
    const navigate = useNavigate();
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsParsing(true);
        setError(null);

        // Parse CSV
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                console.log('Parsed Results:', results);
                if (results.errors.length > 0) {
                    setError(`Error parsing file: ${results.errors[0].message}`);
                    setIsParsing(false);
                } else {
                    // Simulate API upload delay
                    setTimeout(() => {
                        setIsParsing(false);
                        setUploadSuccess(true);
                        
                        // Redirect after success animation
                        setTimeout(() => {
                            // Mock ID 123 for now
                            navigate('/dataset/123/clean');
                        }, 1500);
                    }, 1000);
                }
            },
            error: (err) => {
                setError(`File reading error: ${err.message}`);
                setIsParsing(false);
            }
        });
    }, [navigate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv'],
            'text/plain': ['.csv', '.txt']
        },
        multiple: false
    });

    return (
        <div className="min-h-screen pt-32 px-6 flex flex-col items-center max-w-5xl mx-auto relative">
            {/* Back Button */}
            <Link to="/dashboard" className="absolute top-24 left-6 md:left-0 flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Dashboard</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 mt-8"
            >
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">Upload Your Data</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Drag and drop your CSV file to begin analysis. We'll automatically detect the schema and clean it for you.
                </p>
            </motion.div>

            <div className="w-full max-w-3xl">
                <AnimatePresence mode="wait">
                    {uploadSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-green-200 shadow-xl rounded-[2rem] p-16 flex flex-col items-center justify-center text-center"
                        >
                            <div className="bg-green-100 p-6 rounded-full mb-8">
                                <Check size={64} className="text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">Upload Complete!</h2>
                            <p className="text-lg text-gray-500">Redirecting to data cleaning workspace...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            {...getRootProps()}
                            className={`
                                relative border-4 border-dashed rounded-[2.5rem] p-16 md:p-24 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
                                ${isDragActive 
                                    ? 'border-black bg-gray-50 scale-[1.01] shadow-2xl' 
                                    : 'border-gray-200 hover:border-gray-400 hover:bg-white hover:shadow-xl bg-white/50 backdrop-blur-sm'
                                }
                                ${error ? 'border-red-400 bg-red-50' : ''}
                            `}
                        >
                            <input {...getInputProps()} />
                            
                            {isParsing ? (
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    >
                                        <Loader2 size={64} className="text-black mb-6" />
                                    </motion.div>
                                    <p className="text-2xl font-semibold text-gray-900">Parsing your data...</p>
                                    <p className="text-gray-500 mt-2">This usually takes just a moment.</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center text-red-500">
                                    <div className="bg-red-100 p-4 rounded-full mb-6">
                                        <AlertCircle size={48} />
                                    </div>
                                    <p className="text-2xl font-bold mb-2">Upload Failed</p>
                                    <p className="text-lg text-red-600/80 mb-8 max-w-md text-center">{error}</p>
                                    <button className="px-6 py-3 bg-red-100 text-red-700 rounded-full font-medium hover:bg-red-200 transition-colors">
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className={`
                                        p-8 rounded-full mb-8 transition-all duration-300
                                        ${isDragActive ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 group-hover:scale-110 group-hover:bg-black group-hover:text-white'}
                                    `}>
                                        <UploadCloud size={64} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4 text-gray-900 tracking-tight">
                                        {isDragActive ? 'Drop it like it\'s hot!' : 'Drag & Drop your CSV here'}
                                    </h3>
                                    <p className="text-xl text-gray-400 mb-10 font-light">or click to browse files</p>
                                    
                                    <div className="flex items-center gap-3 text-sm text-gray-400 border border-gray-200 px-5 py-2 rounded-full bg-white shadow-sm">
                                        <FileText size={16} />
                                        <span className="font-medium">Supports .csv, .txt (Max 50MB)</span>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Upload;
