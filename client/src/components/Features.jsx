import React from 'react';
import { motion } from 'framer-motion';
import {
    FaDatabase, FaCommentDots, FaChartPie, FaCode, FaLayerGroup, FaKeyboard,
} from 'react-icons/fa';
import '../styles/Features.css';

const features = [
    {
        icon: <FaDatabase />,
        title: 'CSV + Excel ingest',
        description: 'Drop .csv or .xlsx (up to 25 MB). Auto type-inference: INTEGER, FLOAT, BOOLEAN, TIMESTAMP, TEXT — handles currency, scientific notation, and ISO dates.',
    },
    {
        icon: <FaCommentDots />,
        title: 'Conversational analysis',
        description: 'Multi-turn chat with memory. Ask "now break that down by city" — the assistant reuses your prior query. Self-corrects when its SQL fails.',
    },
    {
        icon: <FaChartPie />,
        title: '22 chart types',
        description: 'Bar, line, scatter, heatmap, treemap, sunburst, funnel, calendar, radar, boxplot, waffle, KPI, bump, stream, and more. AI picks; you can switch any time.',
    },
    {
        icon: <FaLayerGroup />,
        title: 'Pin insights, build dashboards',
        description: 'Save any chart to Insights. Compose drag-and-drop dashboards. Every tile re-executes its SQL on load — never stale.',
    },
    {
        icon: <FaCode />,
        title: 'Sandboxed SQL',
        description: 'Every generated query runs in a read-only transaction, AST-validated (no DROP/DELETE/UPDATE), capped by row + time limits. Every SQL is shown in plain English.',
    },
    {
        icon: <FaKeyboard />,
        title: '⌘K, dark mode, Hindi',
        description: 'Command palette to jump anywhere. Dark/light theme that persists. Ask in English or Hindi — SQL stays English, answers in your language.',
    },
];

const Features = () => {
    return (
        <section id="capabilities" className="features-section" style={{ scrollMarginTop: '120px' }}>
            <div className="features-container">
                <motion.div
                    className="features-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <span className="features-badge">Capabilities</span>
                    <h2>Built for self-serve analytics</h2>
                    <p>Six pillars. Zero SQL fluency required.</p>
                </motion.div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 50 }}
                            whileHover={{ scale: 1.04, y: -8, transition: { duration: 0.2 } }}
                        >
                            <div className="feature-icon-wrapper">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
