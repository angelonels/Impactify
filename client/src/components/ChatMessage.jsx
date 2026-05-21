import { useState } from 'react';
import { User, Sparkles, AlertTriangle, Pin } from 'lucide-react';
import VizRenderer from './VizRenderer';
import InputDialog from './InputDialog';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export default function ChatMessage({ message, liveResult, datasetId }) {
    const [pinned, setPinned] = useState(false);
    const [pinning, setPinning] = useState(false);
    const [pinOpen, setPinOpen] = useState(false);
    const toast = useToast();

    const isUser = message.role === 'user';

    const submitPin = async (title) => {
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
            setPinOpen(false);
            toast.success(`Pinned "${title}" to Insights.`);
        } catch (e) {
            toast.error(e.message || 'Could not pin insight.');
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

    const defaultTitle = (message.content || '').slice(0, 60) || 'Untitled';

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
                    <button
                        className="chat-msg-pin"
                        onClick={() => !pinned && setPinOpen(true)}
                        disabled={pinning || pinned}
                    >
                        <Pin size={12} /> {pinned ? 'Pinned' : pinning ? 'Pinning…' : 'Pin to insights'}
                    </button>
                )}

                {sql && (
                    <details className="chat-msg-sql">
                        <summary>SQL</summary>
                        <pre>{sql}</pre>
                    </details>
                )}

                <InputDialog
                    open={pinOpen}
                    onClose={() => !pinning && setPinOpen(false)}
                    onConfirm={submitPin}
                    title="Pin to Insights"
                    label="Title"
                    placeholder="e.g. Q4 top cities"
                    defaultValue={defaultTitle}
                    confirmLabel="Pin"
                    busy={pinning}
                    maxLength={120}
                />
            </div>
        </div>
    );
}
