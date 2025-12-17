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