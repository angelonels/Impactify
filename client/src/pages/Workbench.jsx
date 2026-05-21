import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { PromptInputBasic } from '../components/PromptInputBasic';
import ConversationSidebar from '../components/ConversationSidebar';
import ChatMessage from '../components/ChatMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { api } from '../lib/api';
import '../styles/Workbench.css';

const Workbench = () => {
    const { id: datasetId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const conversationId = searchParams.get('c') || null;
    const [messages, setMessages] = useState([]); // server-stored history
    const [liveResults, setLiveResults] = useState({}); // messageId → { data, fallbackMessage, explanation }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
    const bottomRef = useRef(null);

    // Load conversation history when conversationId changes, then re-execute
    // every assistant message's SQL so charts re-hydrate after refresh.
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            if (!conversationId) {
                setMessages([]);
                setLiveResults({});
                return;
            }
            try {
                const json = await api.get(`/api/conversations/${conversationId}`);
                if (cancelled) return;
                const msgs = json.conversation?.messages || [];
                setMessages(msgs);
                setLiveResults({});

                // Fan out: re-execute each assistant message that has SQL.
                msgs
                    .filter((m) => m.role === 'assistant' && m.sql && m.chartType && !m.errorMessage)
                    .forEach(async (m) => {
                        try {
                            const r = await api.post(`/api/conversations/${conversationId}/messages/${m.id}/execute`);
                            if (cancelled) return;
                            setLiveResults((prev) => ({
                                ...prev,
                                [m.id]: { data: r.data, fallbackMessage: null, explanation: null },
                            }));
                        } catch (_) {
                            // Per-message failure: leave the chart blank, SQL is still visible.
                        }
                    });
            } catch (e) {
                if (!cancelled) setError(e.message);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleQuerySubmit = async (inputQuery) => {
        if (!inputQuery.trim()) return;
        setLoading(true);
        setError(null);

        // Optimistic user message
        const tempUserMsg = {
            id: `temp-${Date.now()}`,
            role: 'user',
            content: inputQuery,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);

        try {
            const body = { datasetId, query: inputQuery };
            if (conversationId) body.conversationId = conversationId;
            const data = await api.post('/api/dataset/analyze', body);

            const assistantMsg = {
                id: `asst-${Date.now()}`,
                role: 'assistant',
                content: data.config?.overview || data.explanation || '',
                sql: data.config?.sql,
                chartType: data.config?.chartType,
                rowCount: data.data?.length,
                explanation: data.explanation,
                createdAt: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, assistantMsg]);
            setLiveResults((prev) => ({
                ...prev,
                [assistantMsg.id]: {
                    data: data.data,
                    fallbackMessage: data.fallbackMessage,
                    explanation: data.explanation,
                },
            }));

            // If this was a new conversation, update URL
            if (!conversationId && data.conversationId) {
                setSearchParams({ c: data.conversationId }, { replace: true });
            }
            setSidebarRefreshKey((k) => k + 1);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze data');
            setMessages((prev) => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    role: 'assistant',
                    content: err.message || 'Failed.',
                    errorMessage: err.message,
                    createdAt: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        setSearchParams({}, { replace: true });
        setMessages([]);
        setLiveResults({});
        setError(null);
    };

    const handleSelectConversation = (id) => {
        if (id === null) {
            handleNewChat();
        } else {
            setSearchParams({ c: id }, { replace: true });
        }
    };

    return (
        <div className="workbench-shell">
            <ConversationSidebar
                datasetId={datasetId}
                activeId={conversationId}
                onSelect={handleSelectConversation}
                onNew={handleNewChat}
                refreshKey={sidebarRefreshKey}
            />

            <main className="workbench-main">
                <div className="workbench-thread">
                    {messages.length === 0 && !loading && (
                        <div className="workbench-empty">
                            <h2>Ask anything about your data.</h2>
                            <p>Try: <em>"show monthly sales as a line chart"</em> or <em>"top 5 cities by revenue"</em>.</p>
                        </div>
                    )}

                    {messages.map((m) => (
                        <ChatMessage key={m.id} message={m} liveResult={liveResults[m.id]} datasetId={datasetId} />
                    ))}

                    {loading && (
                        <div className="workbench-thinking">Thinking…</div>
                    )}

                    <div ref={bottomRef} />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="workbench-error"
                        >
                            <AlertCircle size={20} />
                            <span>{error}</span>
                            <button onClick={() => setError(null)}><X size={18} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="workbench-prompt-wrapper">
                    <PromptInputBasic onSubmit={handleQuerySubmit} />
                </div>
            </main>
        </div>
    );
};

export default Workbench;
