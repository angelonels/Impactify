import React from 'react'
import { motion } from 'framer-motion'
import '../styles/HowItWorks.css'

const steps = [
    {
        number: "01",
        title: "Upload Data",
        description: "Drag & drop your CSV, Excel, or JSON files. We'll handle the parsing."
    },
    {
        number: "02",
        title: "Ask Questions",
        description: "Type what you want to know in plain English. No SQL knowledge required."
    },
    {
        number: "03",
        title: "Get Insights",
        description: "Receive instant, interactive visualizations and actionable data."
    }
]

const HowItWorks = () => {
    return (
        <section className="how-it-works-section">
            <div className="hiw-container">
                <motion.div
                    className="hiw-header"
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>How It Works</h2>
                    <p>Three simple steps to data mastery.</p>
                </motion.div>

                <div className="steps-wrapper">
                    <div className="steps-line-container">
                        <motion.div
                            className="steps-line-fill"
                            initial={{ height: 0 }}
                            whileInView={{ height: '100%' }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="steps-list">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="step-item"
                                initial={{ opacity: 0, x: -100, filter: "blur(10px)" }}
                                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{ duration: 0.7, delay: index * 0.2, type: "spring", stiffness: 40 }}
                                whileHover={{ x: 10, transition: { duration: 0.2 } }}
                            >
                                <div className="step-number">{step.number}</div>
                                <div className="step-content">
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
