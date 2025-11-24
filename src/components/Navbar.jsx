import React, { useState, useEffect } from 'react';
import { Hexagon, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <div className="logo">
                    <Hexagon size={32} color="#00f3ff" />
                    <div>CANVEL<span>CHAIN</span>.IO</div>
                </div>

                {/* Desktop Menu */}
                <div className="nav-links">
                    <Link to="/" className="nav-link">Inicio</Link>

                    {/* Hidden Links as per request
                    {['DeFi', 'NFTs', 'Metaverso', 'Aprender'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
                            {item}
                        </a>
                    ))}
                    */}

                    <Link to="/analysis" className="nav-link" style={{ color: '#00f3ff', fontWeight: 'bold' }}>
                        Crypto Análisis
                    </Link>

                    <button className="btn-primary">
                        Conectar Billetera
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu - Simplified for vanilla CSS integration */}
            {isMobileMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    background: 'rgba(5,5,7,0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Link
                        to="/"
                        style={{ fontSize: '1.2rem', color: 'white' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/analysis"
                        style={{ fontSize: '1.2rem', color: '#00f3ff', fontWeight: 'bold' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Crypto Análisis
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
