import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Paperclip } from 'lucide-react';
import '../styles/Hero.css';
import { PromptInputBasic } from '../components/PromptInputBasic';

const Upload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const droppedFile = acceptedFiles[0];
        if (!droppedFile) return;
        setFile(droppedFile);
    }, []);

    const { getRootProps, getInputProps, open } = useDropzone({
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

    const handleGenerate = async (inputValue) => {
        if (!file) {
            alert("Please upload a CSV file first.");
            return;
        }
        
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/dataset/123/analyze');
    };

    return (
        <div className="min-h-screen bg-black text-white relative font-sans selection:bg-white selection:text-black" style={{ paddingTop: '200px' }}>
            {/* Main Content */}
            <div className="flex flex-col items-center px-4 w-full max-w-4xl mx-auto gap-24">

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                    style={{
                        fontSize: '4.5rem',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-2px',
                    }}
                >
                    Upload your csv here
                </motion.h1>

                {/* Upload Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={open}
                    className="btn-primary flex items-center gap-2"
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
                    className="w-[70%] max-w-none"
                >
                    <PromptInputBasic onSubmit={handleGenerate} />
                </motion.div>
            </div>
        </div>
    );
};

export default Upload;
