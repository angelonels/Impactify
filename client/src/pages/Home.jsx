import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import ScrollVelocity from '../components/ScrollVelocity'
import '../styles/ScrollVelocity.css'

const Home = () => {
    return (
        <main>
            <Hero />
            <Features />
            <HowItWorks />
            <ScrollVelocity
                text="AI POWERED ANALYTICS • INSTANT INSIGHTS • NO SQL REQUIRED •"
                velocity={1}
            />
        </main>
    )
}

export default Home
