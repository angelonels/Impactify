import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PromptInputBasic } from '../components/PromptInputBasic';
import VizRenderer from '../components/VizRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import '../styles/Workbench.css';

const Workbench = () => {
  const { id } = useParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuerySubmit = async (inputQuery) => {
    if (!inputQuery.trim()) return;

    setLoading(true);
    setError(null);
    setQuery(inputQuery);

    try {
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const response = await fetch(`${apiUrl}/api/dataset/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId: id, query: inputQuery }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Non-JSON Response:', responseText);
        throw new Error(
          `Server returned non-JSON response (${response.status} ${response.statusText}): ${responseText.substring(0, 100)}...`
        );
      }

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to analyze data');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workbench-container">
      <div className="workbench-header">
        <h1>Analysis Workbench</h1>
        <p>
          Ask questions about your data in plain English. Impactify will
          generate SQL queries and visualizations for you.
        </p>
      </div>

      <div className="workbench-prompt-wrapper">
        <PromptInputBasic onSubmit={handleQuerySubmit} />
      </div>

      {loading && (
        <div className="workbench-loading">Analyzing your data...</div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.5 },
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="workbench-error"
          >
            <div className="workbench-error-icon">
              <AlertCircle style={{ width: 24, height: 24 }} />
            </div>
            <div className="workbench-error-body">
              <h4>Analysis Error</h4>
              <p>{error}</p>
            </div>
            <button
              className="workbench-error-dismiss"
              onClick={() => setError(null)}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="workbench-results"
        >
          {results.config?.overview && (
            <div className="workbench-insight">
              <h3>Insight</h3>
              <p>{results.config.overview}</p>
            </div>
          )}

          <div className="workbench-chart-section">
            <h2>Results</h2>
            <div className="workbench-chart-wrapper">
              <VizRenderer
                data={results.data}
                chartType={results.config?.chartType}
              />
            </div>
          </div>

          <div className="workbench-sql-box">
            <details>
              <summary>View SQL Query</summary>
              <pre className="workbench-sql-code">
                {results.config?.sql}
              </pre>
            </details>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Workbench;

