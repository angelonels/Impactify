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
            <div className="flex flex-col items-center justify-center px-4 w-full max-w-4xl mx-auto">
                
                {/* Heading */}
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-bold mb-24 text-center tracking-tight"
                >
                    Upload your csv here
                </motion.h1>

                {/* Upload Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={open}
                    className="px-8 py-4 bg-white text-black font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mb-24 flex items-center gap-2"
                >
                    <Paperclip size={20} />
                    {file ? file.name : "Upload CSV"}
                </motion.button>

                <input {...getInputProps()} />

                {/* AI Prompt Box */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-2xl relative"
                >
                    <div className="bg-white border-2 border-gray-100 rounded-3xl shadow-2xl p-6 min-h-[350px] flex flex-col relative focus-within:border-gray-300 transition-colors">
                        <textarea
                            ref={textareaRef}
                            value={query}
                            onChange={handleInput}
                            placeholder="explain what you want"
                            className="w-full bg-transparent border-none focus:ring-0 text-xl placeholder-gray-300 resize-none outline-none flex-grow pb-24"
                        />

                        {/* File Status & Error */}
                        <AnimatePresence>
                            {isParsing && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute bottom-20 left-6 flex items-center gap-2 text-gray-400"
                                >
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-sm">Processing...</span>
                                </motion.div>
                            )}
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute bottom-20 left-6 text-red-500 text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Generate Button */}
                        <div className="absolute bottom-6 right-6">
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
                </motion.div>
            </div>
        </div>
    );
};

export default Upload;
