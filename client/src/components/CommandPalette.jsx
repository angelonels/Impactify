import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Database, Sparkles, LayoutDashboard, Upload, Home, Sun, Moon } from 'lucide-react';
import { api } from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import '../styles/CommandPalette.css';

export default function CommandPalette({ open, onClose }) {
    const navigate = useNavigate();
    const { theme, toggle } = useTheme();
    const [datasets, setDatasets] = useState([]);
    const [insights, setInsights] = useState([]);
    const [dashboards, setDashboards] = useState([]);

    useEffect(() => {
        if (!open) return;
        Promise.all([
            api.get('/api/dataset/list').catch(() => ({ datasets: [] })),
            api.get('/api/insights').catch(() => ({ insights: [] })),
            api.get('/api/dashboards').catch(() => ({ dashboards: [] })),
        ]).then(([d, i, b]) => {
            setDatasets(d.datasets || []);
            setInsights(i.insights || []);
            setDashboards(b.dashboards || []);
        });
    }, [open]);

    if (!open) return null;

    const go = (path) => { onClose(); navigate(path); };

    return (
        <div className="cmdk-overlay" onClick={onClose}>
            <div className="cmdk-container" onClick={(e) => e.stopPropagation()}>
                <Command label="Command menu" loop>
                    <Command.Input placeholder="Search datasets, insights, dashboards…" autoFocus />
                    <Command.List>
                        <Command.Empty>No results found.</Command.Empty>

                        <Command.Group heading="Pages">
                            <Command.Item onSelect={() => go('/')}><Home size={14} /> Home</Command.Item>
                            <Command.Item onSelect={() => go('/dashboard')}><Database size={14} /> Datasets</Command.Item>
                            <Command.Item onSelect={() => go('/upload')}><Upload size={14} /> Upload new</Command.Item>
                            <Command.Item onSelect={() => go('/insights')}><Sparkles size={14} /> Insights</Command.Item>
                            <Command.Item onSelect={() => go('/dashboards')}><LayoutDashboard size={14} /> Dashboards</Command.Item>
                        </Command.Group>

                        <Command.Group heading="Actions">
                            <Command.Item onSelect={() => { onClose(); toggle(); }}>
                                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                                Switch to {theme === 'dark' ? 'light' : 'dark'} mode
                            </Command.Item>
                        </Command.Group>

                        {datasets.length > 0 && (
                            <Command.Group heading="Datasets">
                                {datasets.slice(0, 10).map((d) => (
                                    <Command.Item key={d.id} onSelect={() => go(`/dataset/${d.id}/analyze`)}>
                                        <Database size={14} /> {d.datasetName}
                                        <span className="cmdk-meta">{d.status}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {insights.length > 0 && (
                            <Command.Group heading="Insights">
                                {insights.slice(0, 10).map((i) => (
                                    <Command.Item key={i.id} onSelect={() => go(`/insights`)}>
                                        <Sparkles size={14} /> {i.title}
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {dashboards.length > 0 && (
                            <Command.Group heading="Dashboards">
                                {dashboards.slice(0, 10).map((b) => (
                                    <Command.Item key={b.id} onSelect={() => go(`/dashboards/${b.id}`)}>
                                        <LayoutDashboard size={14} /> {b.name}
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}
