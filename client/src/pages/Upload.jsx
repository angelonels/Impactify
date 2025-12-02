import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';

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
        <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold mb-4">Upload Your Data</h1>
                <p className="text-gray-500">Drag and drop your CSV file to begin analysis.</p>
            </motion.div>

            <div className="w-full max-w-2xl">
                <AnimatePresence mode="wait">
                    {uploadSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-green-50 border-2 border-green-500 rounded-3xl p-12 flex flex-col items-center justify-center text-green-800"
                        >
                            <div className="bg-green-100 p-4 rounded-full mb-4">
                                <Check size={48} className="text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Upload Complete!</h2>
                            <p>Redirecting to data cleaning...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            {...getRootProps()}
                            className={`
                                relative border-3 border-dashed rounded-3xl p-12 md:p-24 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                                ${isDragActive ? 'border-black bg-gray-50 scale-[1.02]' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'}
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
                                        <Loader2 size={48} className="text-black mb-4" />
                                    </motion.div>
                                    <p className="text-lg font-medium">Parsing your data...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center text-red-500">
                                    <AlertCircle size={48} className="mb-4" />
                                    <p className="text-lg font-medium mb-2">Upload Failed</p>
                                    <p className="text-sm">{error}</p>
                                    <p className="text-xs mt-4 text-gray-400">Click to try again</p>
                                </div>
                            ) : (
                                <>
                                    <div className={`p-6 rounded-full bg-gray-100 mb-6 transition-colors ${isDragActive ? 'bg-black text-white' : 'text-gray-600'}`}>
                                        <UploadCloud size={48} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">
                                        {isDragActive ? 'Drop it like it\'s hot!' : 'Drag & Drop your CSV here'}
                                    </h3>
                                    <p className="text-gray-400 mb-6">or click to browse files</p>
                                    
                                    <div className="flex items-center gap-2 text-xs text-gray-300 border border-gray-200 px-3 py-1 rounded-full">
                                        <FileText size={12} />
                                        <span>Supports .csv, .txt</span>
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
