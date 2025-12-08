import React from 'react';
import ChromaGrid from '../components/ChromaGrid';
import Navbar from '../components/Navbar';

const AboutUs = () => {
    const teamMembers = [
        {
            image: 'https://i.pinimg.com/736x/62/b4/6b/62b46b8c60fdd37418d66e39fe47ae90.jpg',
            title: 'Angelo Nelson',
            github: 'https://github.com/angelonels',
            linkedin: 'https://www.linkedin.com/in/angelo-nelson-64b46830b/',
            borderColor: '#3B82F6',
            gradient: 'linear-gradient(145deg, #3B82F6, #000)',
            url: '#'
        },
        {
            image: 'https://png.pngtree.com/png-clipart/20240508/original/pngtree-coding-clipart-guy-in-glasses-computer-tech-cartoon-vector-illustration-png-image_15035827.png',
            title: 'Ayush Kumar Singh',
            github: 'https://github.com/AyushCoder9',
            linkedin: 'https://www.linkedin.com/in/ayush-kumar-singh-910379320/',
            borderColor: '#10B981',
            gradient: 'linear-gradient(180deg, #10B981, #000)',
            url: '#'
        },
        {
            image: 'https://cdn.vectorstock.com/i/500p/01/62/software-developer-cartoon-vector-58780162.jpg',
            title: 'Isha Singh',
            github: 'https://github.com/Ishiezz',
            linkedin: 'https://www.linkedin.com/in/isha-singh-045212348/',
            borderColor: '#F59E0B',
            gradient: 'linear-gradient(165deg, #F59E0B, #000)',
            url: '#'
        },
        {
            image: 'https://avatars.githubusercontent.com/u/184392826?v=4',
            title: 'Rohit Nair P',
            github: 'https://github.com/Vegapunk-debug',
            linkedin: 'https://www.linkedin.com/in/rohit-nair-p-7a535b251/?skipRedirect=true',
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
                        speed={20}
                    />
                </div>

                {/* Donation Section */}
                <div className="mt-24 mb-12 w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        Support Our Mission
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        Help us continue building innovative tools for data analysis. Your contribution powers our servers and fuels future development.
                    </p>
                    
                    <div className="relative group inline-block">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black p-4 rounded-xl border border-white/10">
                            <img 
                                src="/donation_qr_code.jpeg" 
                                alt="Donation QR Code" 
                                className="w-48 h-48 object-contain rounded-lg"
                            />
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-6">
                        Scan to donate via UPI
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
