import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Paperclip, X, FileText, Loader2, ArrowLeft } from 'lucide-react';

const Upload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const textareaRef = useRef(null);

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
                    // Simulate processing
                    setTimeout(() => {
                        setIsParsing(false);
                        setFile(droppedFile);
                    }, 1000);
                }
            },
            error: (err) => {
                setError(`File reading error: ${err.message}`);
                setIsParsing(false);
            }
        });
    }, []);

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv'],
            'text/plain': ['.csv', '.txt']
        },
        multiple: false,
        noClick: true,
        noKeyboard: true
    });

    const handleGenerate = () => {
        if (!file) return;
        navigate('/dataset/123/analyze');
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setError(null);
    };

    // Auto-resize textarea
    const handleInput = (e) => {
        setQuery(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-black relative font-sans selection:bg-black selection:text-white pt-24 justify-center">

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center px-4 w-full max-w-4xl mx-auto">
                
                {/* Heading */}
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-bold mb-24 text-center tracking-tight"
                >
                    Upload your csv here
                </motion.h1>

                {/* AI Prompt Box Container */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-full relative"
                >
                    <div 
                        {...getRootProps()}
                        className={`
                            relative bg-white border-2 rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden
                            ${isDragActive ? 'border-black ring-4 ring-black/5' : 'border-gray-200 hover:border-gray-300'}
                            ${error ? 'border-red-500' : ''}
                        `}
                    >
                        <input {...getInputProps()} />

                        {/* Input Area */}
                        <div className="p-6 min-h-[160px] flex flex-col">
                            <textarea
                                ref={textareaRef}
                                value={query}
                                onChange={handleInput}
                                placeholder="Describe how you want to analyze this data..."
                                className="w-full bg-transparent border-none focus:ring-0 text-xl placeholder-gray-300 resize-none outline-none max-h-[300px] overflow-y-auto"
                                rows={1}
                            />

                            {/* File Attachment Chip */}
                            <AnimatePresence>
                                {file && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="mt-4 self-start inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200"
                                    >
                                        <FileText size={14} className="text-gray-500" />
                                        <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                                        <button 
                                            onClick={removeFile}
                                            className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <X size={14} className="text-gray-500" />
                                        </button>
                                    </motion.div>
                                )}
                                {isParsing && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-4 self-start inline-flex items-center gap-2 text-gray-400"
                                    >
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="text-sm">Processing...</span>
                                    </motion.div>
                                )}
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-4 self-start text-red-500 text-sm font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Bottom Controls */}
                            <div className="mt-auto pt-6 flex justify-between items-end">
                                {/* Upload Trigger */}
                                <button 
                                    onClick={open}
                                    className="p-3 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-black transition-all group relative"
                                    title="Attach CSV"
                                >
                                    <Paperclip size={24} />
                                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        Attach CSV
                                    </span>
                                </button>

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={!file}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                                        ${file 
                                            ? 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl translate-y-0' 
                                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <span>Generate</span>
                                    <ArrowUp size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Helper Text */}
                    <div className="absolute -bottom-12 left-0 w-full text-center text-gray-400 text-sm">
                        Supports .csv, .excel • Max 50MB
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Upload;
