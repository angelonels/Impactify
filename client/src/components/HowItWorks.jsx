import React from 'react'
import { motion } from 'framer-motion'
import '../styles/HowItWorks.css'

const steps = [
    {
        number: "01",
        title: "Upload",
        description: "Drop a CSV or Excel file. The cleaner infers column types in seconds."
    },
    {
        number: "02",
        title: "Chat",
        description: "Ask anything in English or Hindi. Follow up naturally — the assistant remembers context."
    },
    {
        number: "03",
        title: "Pin + Compose",
        description: "Save the charts you love to Insights. Drag them onto Dashboards. Open them later; data refreshes live."
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
                    <h2>How it works</h2>
                    <p>Three steps. No SQL. No setup.</p>
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
