import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './ChromaGrid.css';

const ChromaGrid = ({
    items,
    className = '',
    radius = 300,
    damping = 0.45,
    fadeOut = 0.6,
    ease = 'power3.out',
    speed = 20
}) => {
    const rootRef = useRef(null);
    const trackRef = useRef(null);
    const fadeRef = useRef(null);
    const setX = useRef(null);
    const setY = useRef(null);
    const pos = useRef({ x: 0, y: 0 });

    const demo = [
        {
            image: 'https://i.pravatar.cc/300?img=8',
            title: 'Alex Rivera',
            subtitle: 'Full Stack Developer',
            handle: '@alexrivera',
            borderColor: '#4F46E5',
            gradient: 'linear-gradient(145deg, #4F46E5, #000)',
            url: 'https://github.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=11',
            title: 'Jordan Chen',
            subtitle: 'DevOps Engineer',
            handle: '@jordanchen',
            borderColor: '#10B981',
            gradient: 'linear-gradient(210deg, #10B981, #000)',
            url: 'https://linkedin.com/in/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=3',
            title: 'Morgan Blake',
            subtitle: 'UI/UX Designer',
            handle: '@morganblake',
            borderColor: '#F59E0B',
            gradient: 'linear-gradient(165deg, #F59E0B, #000)',
            url: 'https://dribbble.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=16',
            title: 'Casey Park',
            subtitle: 'Data Scientist',
            handle: '@caseypark',
            borderColor: '#EF4444',
            gradient: 'linear-gradient(195deg, #EF4444, #000)',
            url: 'https://kaggle.com/'
        }
    ];

    const rawData = items?.length ? items : demo;
    const data = [...rawData, ...rawData, ...rawData, ...rawData];

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;


        setX.current = gsap.quickSetter(el, '--x', 'px');
        setY.current = gsap.quickSetter(el, '--y', 'px');
        const { width, height } = el.getBoundingClientRect();
        pos.current = { x: width / 2, y: height / 2 };
        setX.current(pos.current.x);
        setY.current(pos.current.y);


        const track = trackRef.current;
        if (track) {
            const totalWidth = track.scrollWidth;
            const singleSetWidth = totalWidth / 4;

            gsap.to(track, {
                x: -singleSetWidth,
                duration: speed,
                ease: "none",
                repeat: -1,
                onRepeat: () => {
                    gsap.set(track, { x: 0 });
                }
            });
        }

    }, [speed]);

    const handleMove = e => {
        const r = rootRef.current.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;


        if (setX.current) setX.current(x);
        if (setY.current) setY.current(y);

        gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    };

    const handleLeave = () => {
        gsap.to(fadeRef.current, {
            opacity: 1,
            duration: fadeOut,
            overwrite: true
        });
    };

    const handleCardClick = url => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleCardMove = e => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            ref={rootRef}
            className={`chroma-grid ${className}`}
            style={{
                '--r': `${radius}px`,
            }}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
        >
            <div className="chroma-track" ref={trackRef}>
                {data.map((c, i) => (
                    <article
                        key={i}
                        className="chroma-card"
                        onMouseMove={handleCardMove}
                        onClick={() => handleCardClick(c.url)}
                        style={{
                            '--card-border': c.borderColor || 'transparent',
                            '--card-gradient': c.gradient,
                            cursor: c.url ? 'pointer' : 'default'
                        }}
                    >
                        <div className="chroma-img-wrapper">
                            <img src={c.image} alt={c.title} loading="lazy" />
                        </div>
                        <footer className="chroma-info">
                            <h3 className="name">{c.title}</h3>
                            <div className="social-links" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                {c.github && (
                                    <a
                                        href={c.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: '#fff', fontSize: '1.2rem', zIndex: 10, position: 'relative' }}
                                    >
                                        <FaGithub />
                                    </a>
                                )}
                                {c.linkedin && (
                                    <a
                                        href={c.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: '#0A66C2', fontSize: '1.2rem', zIndex: 10, position: 'relative' }}
                                    >
                                        <FaLinkedin />
                                    </a>
                                )}
                            </div>
                            {c.location && <span className="location">{c.location}</span>}
                        </footer>
                    </article>
                ))}
            </div>
            <div className="chroma-overlay" />
            <div ref={fadeRef} className="chroma-fade" />
        </div>
    );
};

export default ChromaGrid;
