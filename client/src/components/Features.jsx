import React from 'react'
import { motion } from 'framer-motion'
import { FaDatabase, FaMagic, FaChartLine, FaCode } from 'react-icons/fa'
import '../styles/Features.css'

const features = [
    {
        icon: <FaDatabase />,
        title: "Smart Data Ingestion",
        description: "Upload CSV, Excel, or JSON. Our AI automatically detects schemas and cleans your data instantly."
    },
    {
        icon: <FaMagic />,
        title: "Natural Language Queries",
        description: "Ask questions in plain English. 'Show me sales by region' becomes complex SQL automatically."
    },
    {
        icon: <FaChartLine />,
        title: "Instant Visualizations",
        description: "Get beautiful, interactive charts generated on the fly. No manual configuration needed."
    },
    {
        icon: <FaCode />,
        title: "SQL Export",
        description: "Need the raw query? View and export the generated SQL for use in your own workflows."
    }
]

const Features = () => {
    return (
        <section className="features-section">
            <div className="features-container">
                <motion.div
                    className="features-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="features-badge">Capabilities</span>
                    <h2>Supercharge Your Analytics</h2>
                    <p>Everything you need to go from raw data to actionable insights.</p>
                </motion.div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 50 }}
                            whileHover={{ scale: 1.05, y: -10, transition: { duration: 0.2 } }}
                        >
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
