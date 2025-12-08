import React from 'react';
import ChromaGrid from '../components/ChromaGrid';
import Navbar from '../components/Navbar';

const AboutUs = () => {
    const teamMembers = [
        {
            image: 'https://i.pravatar.cc/300?img=1',
            title: 'Member 1',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            borderColor: '#3B82F6',
            gradient: 'linear-gradient(145deg, #3B82F6, #000)',
            url: '#'
        },
        {
            image: 'https://i.pravatar.cc/300?img=2',
            title: 'Member 2',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            borderColor: '#10B981',
            gradient: 'linear-gradient(180deg, #10B981, #000)',
            url: '#'
        },
        {
            image: 'https://i.pravatar.cc/300?img=3',
            title: 'Member 3',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            borderColor: '#F59E0B',
            gradient: 'linear-gradient(165deg, #F59E0B, #000)',
            url: '#'
        },
        {
            image: 'https://i.pravatar.cc/300?img=4',
            title: 'Member 4',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            borderColor: '#EF4444',
            gradient: 'linear-gradient(195deg, #EF4444, #000)',
            url: '#'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-8 pt-40">
                <h1 className="text-4xl font-bold text-center mb-8 mt-24">Meet the Team!</h1>
                <div style={{ width: '100%', maxWidth: '1200px', height: '600px', position: 'relative' }}>
                    <ChromaGrid
                        items={teamMembers}
                        radius={300}
                        damping={0.45}
                        fadeOut={0.6}
                        ease="power3.out"
                        speed={30}
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
