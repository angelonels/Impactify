import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaFileCsv } from 'react-icons/fa';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import '../styles/Upload.css';

const Upload = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const toast = useToast();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (file) => {
        if (!file) return;
        const name = (file.name || '').toLowerCase();
        const ok = /\.(csv|xlsx|xls)$/.test(name) ||
            file.type === 'text/csv' ||
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel';
        if (ok) setFile(file);
        else toast.error('Please upload a CSV, XLSX, or XLS file.');
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const data = await api.post('/api/dataset/upload', formData);
            toast.success('Upload complete. Cleaning your data now…');
            navigate(`/dataset/${data.datasetId}/analyze`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-header">
                <h2>Upload Your Data</h2>
                <p>Drag and drop a CSV or Excel file to begin analysis.</p>
            </div>

            <div
                className={`dropzone ${isDragging ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv,.xlsx,.xls"
                    hidden
                />

                {file ? (
                    <div className="file-info">
                        <FaFileCsv className="upload-icon upload-icon-active" />
                        <h3>{file.name}</h3>
                        <p>{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                ) : (
                    <>
                        <FaCloudUploadAlt className="upload-icon" />
                        <h3>Click to upload or drag and drop</h3>
                        <p className="upload-hint">CSV, XLSX, or XLS · up to 25 MB</p>
                    </>
                )}
            </div>

            <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={!file || isUploading}
            >
                {isUploading ? 'Processing...' : 'Analyze Data'}
            </button>
            
            {isUploading && (
                <p className="upload-note">
                    Please wait, this may take a moment due to server latency...
                </p>
            )}
        </div>
    );
};

export default Upload;