import { useState } from 'react';
import { User, Sparkles, AlertTriangle, Pin } from 'lucide-react';
import VizRenderer from './VizRenderer';
import { api } from '../lib/api';

export default function ChatMessage({ message, liveResult, datasetId }) {
    const [pinned, setPinned] = useState(false);
    const [pinning, setPinning] = useState(false);

    const isUser = message.role === 'user';

    const handlePin = async () => {
        if (pinned || !message.sql || !datasetId) return;
        const title = prompt('Insight title:', (message.content || '').slice(0, 60) || 'Untitled');
        if (!title) return;
        setPinning(true);
        try {
            await api.post('/api/insights', {
                datasetId,
                title,
                sql: message.sql,
                chartType: message.chartType || 'table',
                overview: message.content,
            });
            setPinned(true);
        } catch (e) {
            alert(`Pin failed: ${e.message}`);
        } finally {
            setPinning(false);
        }
    };

    if (isUser) {
        return (
            <div className="chat-msg user">
                <div className="chat-msg-avatar"><User size={16} /></div>
                <div className="chat-msg-bubble">{message.content}</div>
            </div>
        );
    }

    const error = !!message.errorMessage;
    const sql = message.sql;
    const chartType = message.chartType;
    const explanation = message.explanation;
    const data = liveResult?.data;
    const fallback = liveResult?.fallbackMessage;
    const canPin = sql && datasetId && !error;

    return (
        <div className={`chat-msg assistant ${error ? 'error' : ''}`}>
            <div className="chat-msg-avatar">
                {error ? <AlertTriangle size={16} /> : <Sparkles size={16} />}
            </div>
            <div className="chat-msg-body">
                <div className="chat-msg-bubble">{message.content}</div>

                {explanation && !error && (
                    <details className="chat-msg-explain">
                        <summary>How this was queried</summary>
                        <p>{explanation}</p>
                    </details>
                )}

                {fallback && <div className="chat-msg-fallback">⚠ {fallback}</div>}

                {data && chartType && (
                    <div className="chat-msg-chart">
                        <VizRenderer data={data} chartType={chartType} />
                    </div>
                )}

                {canPin && (
                    <button className="chat-msg-pin" onClick={handlePin} disabled={pinning || pinned}>
                        <Pin size={12} /> {pinned ? 'Pinned' : pinning ? 'Pinning…' : 'Pin to insights'}
                    </button>
                )}

                {sql && (
                    <details className="chat-msg-sql">
                        <summary>SQL</summary>
                        <pre>{sql}</pre>
                    </details>
                )}
            </div>
        </div>
    );
}
