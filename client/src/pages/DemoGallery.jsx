import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Upload, MessageSquare, Sparkles, LayoutDashboard, FileSpreadsheet, Moon, Command, ArrowRight,
} from 'lucide-react';
import VizRenderer from '../components/VizRenderer';
import '../styles/DemoGallery.css';

// ─── Demo data (fabricated, mirrors samples/sales_sample.csv shape) ────────────
const monthlySales = [
    { month: '2024-01-15', total_sales: 6311 }, { month: '2024-02-15', total_sales: 5780 },
    { month: '2024-03-15', total_sales: 6500 }, { month: '2024-04-15', total_sales: 6140 },
    { month: '2024-05-15', total_sales: 7370 }, { month: '2024-06-15', total_sales: 7330 },
    { month: '2024-07-15', total_sales: 7530 }, { month: '2024-08-15', total_sales: 7680 },
    { month: '2024-09-15', total_sales: 7170 }, { month: '2024-10-15', total_sales: 7560 },
    { month: '2024-11-15', total_sales: 6390 }, { month: '2024-12-15', total_sales: 7320 },
];

const topCities = [
    { city: 'Mumbai',    total_sales: 16500 },
    { city: 'Delhi',     total_sales: 18900 },
    { city: 'Bangalore', total_sales: 14700 },
    { city: 'Chennai',   total_sales: 13800 },
    { city: 'Pune',      total_sales: 12100 },
];

const categoryShare = [
    { product_category: 'Electronics', total_sales: 31200 },
    { product_category: 'Apparel',     total_sales: 17400 },
    { product_category: 'Home',        total_sales: 16800 },
    { product_category: 'Groceries',   total_sales:  9100 },
];

const heatmapData = [
    { city: 'Mumbai',    product_category: 'Electronics', sales: 8400 },
    { city: 'Mumbai',    product_category: 'Apparel',     sales: 4500 },
    { city: 'Mumbai',    product_category: 'Home',        sales: 3100 },
    { city: 'Delhi',     product_category: 'Electronics', sales: 9800 },
    { city: 'Delhi',     product_category: 'Apparel',     sales: 3700 },
    { city: 'Delhi',     product_category: 'Home',        sales: 5400 },
    { city: 'Bangalore', product_category: 'Electronics', sales: 7200 },
    { city: 'Bangalore', product_category: 'Apparel',     sales: 3100 },
    { city: 'Bangalore', product_category: 'Home',        sales: 4400 },
];

const scatterData = [
    { units_sold: 12, sales: 1850 }, { units_sold: 18, sales: 920 },
    { units_sold: 42, sales: 540 },  { units_sold: 8,  sales: 3200 },
    { units_sold: 9,  sales: 1420 }, { units_sold: 14, sales: 680 },
    { units_sold: 6,  sales: 2400 }, { units_sold: 7,  sales: 1100 },
    { units_sold: 22, sales: 1560 }, { units_sold: 11, sales: 2780 },
    { units_sold: 19, sales: 990 },  { units_sold: 9,  sales: 2150 },
];

const totalRevenueKpi = [{ total: 86420 }];

// Multi-metric per category — for radar
const radarData = [
    { city: 'Mumbai',    sales: 16500, growth: 12, satisfaction: 86, retention: 78 },
    { city: 'Delhi',     sales: 18900, growth: 18, satisfaction: 81, retention: 72 },
    { city: 'Bangalore', sales: 14700, growth: 24, satisfaction: 89, retention: 80 },
    { city: 'Chennai',   sales: 13800, growth: 9,  satisfaction: 84, retention: 76 },
    { city: 'Pune',      sales: 12100, growth: 15, satisfaction: 82, retention: 74 },
];

// Per-day for a calendar — 60 days of values
const calendarData = Array.from({ length: 60 }, (_, i) => {
    const d = new Date(2024, 0, 1 + i);
    return { day: d.toISOString().slice(0, 10), value: Math.round(50 + Math.sin(i / 6) * 30 + Math.random() * 20) };
});

// Multi-series for stream
const streamData = monthlySales.map((m, i) => ({
    month: m.month,
    electronics: 1500 + Math.sin(i / 2) * 600 + Math.random() * 200,
    apparel:     900 + Math.cos(i / 2.4) * 400 + Math.random() * 150,
    home:        1100 + Math.sin(i / 3.1) * 500 + Math.random() * 180,
    groceries:   500 + Math.cos(i / 3) * 200 + Math.random() * 100,
}));

// Bump — rank over time (4 cities × 6 months)
const bumpData = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'].flatMap((city, ci) =>
    Array.from({ length: 6 }, (_, mi) => ({
        month: `M${mi + 1}`,
        city,
        rank: ((ci + mi) % 4) + 1,
    }))
);

// Boxplot / swarmplot — sales by city, multiple data points per city
const cityDistribution = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'].flatMap((city) =>
    Array.from({ length: 18 }, () => ({ city, sales: 600 + Math.random() * 3000 }))
);

// Marimekko-friendly: per category, several numeric dims
const marimekkoData = categoryShare.map((c, i) => ({
    ...c,
    online_share: 40 + i * 10,
    retail_share: 60 - i * 10,
}));

// ─── Walkthrough steps ─────────────────────────────────────────────────────────
const STEPS = [
    {
        icon: Upload,
        title: '1. Upload CSV or Excel',
        body: 'Drop a CSV/XLSX into the upload page. Impactify ingests rows, infers column types (INTEGER, FLOAT, BOOLEAN, TIMESTAMP, TEXT) automatically, and tells you when the dataset is ready.',
        link: { to: '/upload', label: 'Try upload' },
    },
    {
        icon: MessageSquare,
        title: '2. Chat with your data',
        body: 'Ask questions in plain English (or Hindi). The assistant remembers the last 6 turns, so follow-ups like "now break that down by city" work naturally. Every generated SQL is read-only, AST-validated, and capped by a row limit.',
    },
    {
        icon: Sparkles,
        title: '3. Pin insights you love',
        body: 'A chart that nails the answer? Pin it. Pinned insights live in your Insights gallery and re-execute their SQL fresh every time you open them — never stale.',
        link: { to: '/insights', label: 'Open Insights' },
    },
    {
        icon: LayoutDashboard,
        title: '4. Compose dashboards',
        body: 'Drag insights onto a Dashboard. Resize. Rearrange. Layout persists. Open the dashboard later and every tile re-fetches live data.',
        link: { to: '/dashboards', label: 'Open Dashboards' },
    },
    {
        icon: FileSpreadsheet,
        title: '5. Excel + multilingual',
        body: 'Upload .xlsx as easily as .csv. Ask questions in English or Hindi — the system writes SQL in English and replies in your language.',
    },
    {
        icon: Command,
        title: '6. ⌘K everywhere',
        body: 'Cmd+K opens the command palette: jump to any dataset, insight, dashboard, toggle theme. Keyboard-first power-user experience.',
    },
    {
        icon: Moon,
        title: '7. Dark + Light',
        body: 'Theme toggle in the navbar. Choice persists. Charts retint themselves automatically.',
    },
];

const ChartDemo = ({ title, sub, type, data }) => (
    <div className="demo-card">
        <div className="demo-card-head">
            <h3>{title}</h3>
            <span>{sub}</span>
        </div>
        <div className="demo-card-body">
            <VizRenderer data={data} chartType={type} />
        </div>
    </div>
);

const DemoGallery = () => {
    return (
        <div className="demo-page">
            <header className="demo-hero">
                <h1>The complete Impactify experience</h1>
                <p>
                    From CSV to chat to chart to dashboard. Every feature, demoed below.
                    Real components, real data — same renderer you'd hit in the live app.
                </p>
                <div className="demo-hero-actions">
                    <Link to="/upload" className="demo-cta primary">
                        Start with your own data <ArrowRight size={16} />
                    </Link>
                    <Link to="/dashboard" className="demo-cta">View datasets</Link>
                </div>
            </header>

            <section className="demo-section">
                <h2>How it works</h2>
                <div className="demo-steps">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04 }}
                                className="demo-step"
                            >
                                <div className="demo-step-icon"><Icon size={22} /></div>
                                <h3>{s.title}</h3>
                                <p>{s.body}</p>
                                {s.link && (
                                    <Link to={s.link.to} className="demo-step-link">
                                        {s.link.label} →
                                    </Link>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            <section className="demo-section">
                <h2>What charts can it produce?</h2>
                <p className="demo-section-sub">
                    22 chart codes, all driven by the same plain-English questions. The chip row above
                    each chart lets you switch the view without re-querying.
                </p>
                <div className="demo-grid">
                    <ChartDemo
                        title='"Total revenue"'
                        sub="kpi · 1 row"
                        type="kpi"
                        data={totalRevenueKpi}
                    />
                    <ChartDemo
                        title='"Top 5 cities by sales"'
                        sub="bar · grouped + sorted"
                        type="bar"
                        data={topCities}
                    />
                    <ChartDemo
                        title='"Monthly sales trend"'
                        sub="line · TIMESTAMP x-axis, ORDER BY"
                        type="line"
                        data={monthlySales}
                    />
                    <ChartDemo
                        title='"Share of revenue by category"'
                        sub="pie · part-to-whole"
                        type="pie"
                        data={categoryShare}
                    />
                    <ChartDemo
                        title='"Sales by city × category"'
                        sub="heatmap · 2 categorical dims"
                        type="heatmap"
                        data={heatmapData}
                    />
                    <ChartDemo
                        title='"Treemap of categories"'
                        sub="treemap · proportional hierarchy"
                        type="treemap"
                        data={categoryShare}
                    />
                    <ChartDemo
                        title='"Correlation: units sold vs sales"'
                        sub="scatter · 2 numeric"
                        type="scatter"
                        data={scatterData}
                    />
                    <ChartDemo
                        title='"Stacked area over time"'
                        sub="area · filled line"
                        type="area"
                        data={monthlySales}
                    />
                    <ChartDemo
                        title='"Funnel of category revenue"'
                        sub="funnel · ordered stages"
                        type="funnel"
                        data={categoryShare}
                    />
                    <ChartDemo
                        title='"Waffle of category share"'
                        sub="waffle · 100-square grid"
                        type="waffle"
                        data={categoryShare}
                    />
                    <ChartDemo
                        title='"Sunburst by category"'
                        sub="sunburst · radial proportions"
                        type="sunburst"
                        data={categoryShare}
                    />
                    <ChartDemo
                        title='"Radial bars by category"'
                        sub="radial-bar · compact comparison"
                        type="radial-bar"
                        data={categoryShare}
                    />
                    <ChartDemo
                        title='"Donut share"'
                        sub="donut · pie variant"
                        type="donut"
                        data={categoryShare}
                    />
                    <ChartDemo
                        title='"Circle packing of categories"'
                        sub="circle-packing · bubble hierarchy"
                        type="circle-packing"
                        data={categoryShare}
                    />
                    <ChartDemo
                        title='"Multi-attribute city radar"'
                        sub="radar · ≥3 numeric dims"
                        type="radar"
                        data={radarData}
                    />
                    <ChartDemo
                        title='"60-day activity calendar"'
                        sub="calendar · daily heatmap"
                        type="calendar"
                        data={calendarData}
                    />
                    <ChartDemo
                        title='"Stream of category sales"'
                        sub="stream · stacked smoothed area"
                        type="stream"
                        data={streamData}
                    />
                    <ChartDemo
                        title='"Rank-over-time of cities"'
                        sub="bump · rank shifts"
                        type="bump"
                        data={bumpData}
                    />
                    <ChartDemo
                        title='"Sales distribution by city"'
                        sub="boxplot · quartiles per group"
                        type="boxplot"
                        data={cityDistribution}
                    />
                    <ChartDemo
                        title='"Raw sales swarm"'
                        sub="swarmplot · distribution dots"
                        type="swarmplot"
                        data={cityDistribution}
                    />
                    <ChartDemo
                        title='"Marimekko by category"'
                        sub="marimekko · proportional stacks"
                        type="marimekko"
                        data={marimekkoData}
                    />
                    <ChartDemo
                        title='"Top-line table"'
                        sub="table · raw rows"
                        type="table"
                        data={heatmapData}
                    />
                </div>
            </section>

            <section className="demo-section demo-cta-section">
                <h2>Ready to try it on your data?</h2>
                <Link to="/upload" className="demo-cta primary big">
                    Upload a file <ArrowRight size={18} />
                </Link>
            </section>
        </div>
    );
};

export default DemoGallery;
