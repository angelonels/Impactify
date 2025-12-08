import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaFileCsv } from 'react-icons/fa';
import '../styles/Upload.css';

const Upload = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
        if (file && file.type === "text/csv") {
            setFile(file);
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {


            const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
            const response = await fetch(`${apiUrl}/api/dataset/upload`, {
                method: 'POST',
                headers: {},
                body: formData
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error("Non-JSON Response:", responseText);
                throw new Error(`Server returned non-JSON response (${response.status} ${response.statusText}): ${responseText.substring(0, 100)}...`);
            }

            if (response.ok) {
                navigate(`/dataset/${data.datasetId}/analyze`);
            } else {
                console.error("Server Error Detail:", data);
                alert(`Upload Failed: ${data.error || data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Network/Client Error:", error);
            alert(`Network Error: ${error.message}\nTarget API: ${import.meta.env.VITE_API_URL}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-header">
                <h2>Upload Your Data</h2>
                <p>Drag and drop your CSV file to begin analysis.</p>
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
                    accept=".csv"
                    hidden
                />

                {file ? (
                    <div className="file-info">
                        <FaFileCsv className="upload-icon" style={{ color: '#41D1FF' }} />
                        <h3>{file.name}</h3>
                        <p>{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                ) : (
                    <>
                        <FaCloudUploadAlt className="upload-icon" />
                        <h3>Click to upload or drag and drop</h3>
                        <p style={{ color: '#666' }}>CSV files only (Max 10MB)</p>
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
        </div>
    );
};

export default Upload;