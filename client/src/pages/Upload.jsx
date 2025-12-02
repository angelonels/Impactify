import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Paperclip, Mic } from 'lucide-react';
import '../styles/Hero.css';
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '../components/PromptInput';

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

const Upload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState('');
    const [model, setModel] = useState(models[0].id);
    const [status, setStatus] = useState('ready');

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file || !query) return;
        
        setStatus('submitted');
        // Simulate processing
        setTimeout(() => {
            setStatus('ready');
            navigate('/dataset/123/analyze');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-black text-white relative font-sans selection:bg-white selection:text-black" style={{ paddingTop: '200px' }}>
            {/* Main Content */}
            <div className="flex flex-col items-center px-4 w-full max-w-4xl mx-auto gap-16">

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                    style={{
                        fontSize: '4.5rem',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
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
                    className="w-full max-w-2xl"
                >
                    <PromptInput onSubmit={handleSubmit} className="bg-white">
                        <PromptInputTextarea
                            onChange={(e) => setQuery(e.target.value)}
                            value={query}
                            placeholder="explain what you want"
                            className="text-black placeholder:text-gray-400 min-h-[150px]"
                        />
                        <PromptInputToolbar>
                            <PromptInputTools>
                                <PromptInputButton>
                                    <Paperclip size={16} />
                                </PromptInputButton>
                                <PromptInputButton>
                                    <Mic size={16} />
                                    <span>Voice</span>
                                </PromptInputButton>
                                <PromptInputModelSelect onValueChange={setModel} value={model}>
                                    <PromptInputModelSelectTrigger>
                                        <PromptInputModelSelectValue />
                                    </PromptInputModelSelectTrigger>
                                    <PromptInputModelSelectContent>
                                        {models.map((model) => (
                                            <PromptInputModelSelectItem key={model.id} value={model.id}>
                                                {model.name}
                                            </PromptInputModelSelectItem>
                                        ))}
                                    </PromptInputModelSelectContent>
                                </PromptInputModelSelect>
                            </PromptInputTools>
                            <PromptInputSubmit disabled={!query || !file} status={status} />
                        </PromptInputToolbar>
                    </PromptInput>
                </motion.div>
            </div>
        </div>
    );
};

export default Upload;
