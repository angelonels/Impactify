import React from 'react';
import '../styles/DemoGallery.css';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import TableChart from '../components/charts/TableChart';

const DemoGallery = () => {
    // Static Dummy Data for the charts

    // 1. E-Commerce Sales (Bar Chart)
    const ecommerceData = [
        { country: "USA", revenue: 450000 },
        { country: "China", revenue: 380000 },
        { country: "UK", revenue: 150000 },
        { country: "Japan", revenue: 120000 },
        { country: "Germany", revenue: 110000 }
    ];

    // 2. User Growth (Line Chart) expects flat array with xKey and yKey
    const userGrowthData = [
        { month: "Jan", users: 1200 },
        { month: "Feb", users: 1500 },
        { month: "Mar", users: 1400 },
        { month: "Apr", users: 2100 },
        { month: "May", users: 2800 },
        { month: "Jun", users: 3200 }
    ];

    // 3. Marketing Budget (Pie Chart) expects flat array with idKey and valueKey
    const budgetData = [
        { channel: "Social Media", spend: 45 },
        { channel: "SEO", spend: 25 },
        { channel: "Email", spend: 20 },
        { channel: "Events", spend: 10 }
    ];

    // 4. Recent Transactions (Table Chart)
    const tableData = [
        { id: "TXN-001", user: "Alice", amount: "$150.00", status: "Completed", date: "2023-10-15" },
        { id: "TXN-002", user: "Bob", amount: "$85.50", status: "Pending", date: "2023-10-16" },
        { id: "TXN-003", user: "Charlie", amount: "$320.00", status: "Completed", date: "2023-10-16" },
        { id: "TXN-004", user: "Diana", amount: "$45.00", status: "Failed", date: "2023-10-17" },
        { id: "TXN-005", user: "Eve", amount: "$1,200.00", status: "Completed", date: "2023-10-18" }
    ];

    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <h1>Explore Demo Datasets</h1>
                <p>
                    See Impactify in action. We've pre-analyzed some common global datasets 
                    to showcase how our AI instantly visualizes data from plain English prompts.
                </p>
            </div>

            <div className="gallery-grid">
                
                {/* Card 1: Bar Chart */}
                <div className="gallery-card">
                    <h2 className="dataset-title">Global E-Commerce</h2>
                    <div className="prompt-box">
                        <span className="prompt-label">User Asked:</span>
                        <p className="prompt-text">
                            "Show me the top 5 countries by total online revenue as a bar chart."
                        </p>
                    </div>
                    <div className="chart-container">
                        <BarChart 
                            data={ecommerceData} 
                            keys={['revenue']} 
                            indexBy="country" 
                        />
                    </div>
                    <div className="sql-box">
                        <details>
                            <summary className="sql-summary">View AI-Generated SQL</summary>
                            <pre className="sql-code">
{`SELECT country, SUM(revenue) as revenue
FROM ecommerce_sales
GROUP BY country
ORDER BY revenue DESC
LIMIT 5;`}
                            </pre>
                        </details>
                    </div>
                </div>

                {/* Card 2: Line Chart */}
                <div className="gallery-card">
                    <h2 className="dataset-title">Platform Engagement</h2>
                    <div className="prompt-box">
                        <span className="prompt-label">User Asked:</span>
                        <p className="prompt-text">
                            "Plot the growth of active users over the first six months as a line chart."
                        </p>
                    </div>
                    <div className="chart-container">
                        <LineChart data={userGrowthData} xKey="month" yKey="users" />
                    </div>
                    <div className="sql-box">
                        <details>
                            <summary className="sql-summary">View AI-Generated SQL</summary>
                            <pre className="sql-code">
{`SELECT month, active_users as users
FROM platform_engagement
WHERE year = 2023 AND month_num <= 6
ORDER BY month_num ASC;`}
                            </pre>
                        </details>
                    </div>
                </div>

                {/* Card 3: Pie Chart */}
                <div className="gallery-card">
                    <h2 className="dataset-title">Q3 Marketing Spends</h2>
                    <div className="prompt-box">
                        <span className="prompt-label">User Asked:</span>
                        <p className="prompt-text">
                            "What is the percentage breakdown of our marketing budget as a pie chart?"
                        </p>
                    </div>
                    <div className="chart-container">
                        <PieChart data={budgetData} idKey="channel" valueKey="spend" />
                    </div>
                    <div className="sql-box">
                        <details>
                            <summary className="sql-summary">View AI-Generated SQL</summary>
                            <pre className="sql-code">
{`SELECT channel, ROUND((spend / total_budget) * 100) as spend
FROM marketing_q3
GROUP BY channel;`}
                            </pre>
                        </details>
                    </div>
                </div>

                {/* Card 4: Table Chart (Fallback) */}
                <div className="gallery-card">
                    <h2 className="dataset-title">Recent Transactions</h2>
                    <div className="prompt-box">
                        <span className="prompt-label">User Asked:</span>
                        <p className="prompt-text">
                            "Show me the latest 5 transactions in a table."
                        </p>
                    </div>
                    <div className="chart-container" style={{ overflowY: 'auto', padding: '0', background: 'transparent' }}>
                        <TableChart data={tableData} />
                    </div>
                    <div className="sql-box">
                         <details>
                            <summary className="sql-summary">View AI-Generated SQL</summary>
                            <pre className="sql-code">
{`SELECT id, user, amount, status, date
FROM transactions