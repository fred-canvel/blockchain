import React from 'react';
import { Github, Twitter, Linkedin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="col-span-1 md:col-span-2">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                            FRED<span style={{ color: 'var(--primary)' }}>CHAINVEL</span>.IO
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
                            Empoderando a la próxima generación de internet. Brindamos las últimas noticias, análisis y contenido educativo para el mundo descentralizado.
                        </p>
                        <div className="footer-social">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="icon-btn">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1.5rem' }}>Explorar</h4>
                        <ul className="footer-links">
                            {/* Hidden as per request
                            {['DeFi', 'NFTs', 'Metaverso', 'DAOs', 'Capa 2'].map((item) => (
                                <li key={item}><a href="#">{item}</a></li>
                            ))}
                            */}
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/analysis">Crypto Análisis</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1.5rem' }}>Boletín</h4>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            Suscríbete para recibir las últimas noticias cripto.
                        </p>
                        <div className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Ingresa tu email"
                                className="newsletter-input"
                            />
                            <button className="newsletter-btn">
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Fredchainvel.io. Todos los derechos reservados.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="#">Política de Privacidad</a>
                        <a href="#">Términos de Servicio</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
