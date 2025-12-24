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