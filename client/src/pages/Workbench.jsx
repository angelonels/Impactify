import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PromptInputBasic } from '../components/PromptInputBasic';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import { motion } from 'framer-motion';

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dataset/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Auth removed for now
        },
        body: JSON.stringify({ datasetId: id, query: inputQuery }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to analyze data');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const renderVisualization = () => {
    if (!results || !results.data || results.data.length === 0) return null;

    const { config, data } = results;
    const chartType = config.chartType;

    // Helper to find keys
    const keys = Object.keys(data[0]);
    const stringKeys = keys.filter(k => typeof data[0][k] === 'string');
    const numberKeys = keys.filter(k => typeof data[0][k] === 'number');

    // Default heuristics
    const indexBy = stringKeys.length > 0 ? stringKeys[0] : keys[0];
    const xKey = indexBy;
    const yKey = numberKeys.length > 0 ? numberKeys[0] : keys[1] || keys[0];
    const barKeys = numberKeys.length > 0 ? numberKeys : [keys[1]];

    switch (chartType) {
      case 'bar':
        return (
          <div className="h-[500px] w-full bg-white/5 rounded-xl p-4 border border-white/10">
            <BarChart data={data} keys={barKeys} indexBy={indexBy} />
          </div>
        );
      case 'line':
        return (
          <div className="h-[500px] w-full bg-white/5 rounded-xl p-4 border border-white/10">
            <LineChart data={data} xKey={xKey} yKey={yKey} />
          </div>
        );
      case 'pie':
        // Fallback to bar for now if pie not implemented or similar
        return (
          <div className="h-[500px] w-full bg-white/5 rounded-xl p-4 border border-white/10">
             <BarChart data={data} keys={barKeys} indexBy={indexBy} />
          </div>
        );
      case 'table':
      default:
        return (
          <div className="overflow-x-auto bg-white/5 rounded-xl border border-white/10">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/10 text-xs uppercase text-white">
                <tr>
                  {keys.map((key) => (
                    <th key={key} className="px-6 py-3">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    {keys.map((key) => (
                      <td key={key} className="px-6 py-4">{row[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Analysis Workbench</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Ask questions about your data in plain English. Impactify will generate SQL queries and visualizations for you.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <PromptInputBasic onSubmit={handleQuerySubmit} />
      </div>

      {loading && (
        <div className="text-center text-white animate-pulse">
          Analyzing your data...
        </div>
      )}

      {error && (
        <div className="text-center text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {results.config.overview && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-xl">
              <h3 className="text-indigo-400 font-semibold mb-2">Insight</h3>
              <p className="text-gray-300">{results.config.overview}</p>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Results</h2>
            {renderVisualization()}
          </div>
          
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl">
             <details>
                <summary className="cursor-pointer text-gray-500 text-sm hover:text-gray-300">View SQL Query</summary>
                <pre className="mt-2 text-xs text-green-400 overflow-x-auto p-2 bg-black/50 rounded">
                    {results.config.sql}
                </pre>
             </details>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Workbench;
