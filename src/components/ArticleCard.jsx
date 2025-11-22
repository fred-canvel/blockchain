import React, { useState } from 'react';
import { ArrowUpRight, Clock, Tag, Share2, X } from 'lucide-react';

const ArticleCard = ({ article }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShare = (e) => {
        e.stopPropagation();
        const url = window.location.href; // In a real app, this would be the specific article URL
        navigator.clipboard.writeText(url).then(() => {
            alert('Enlace copiado al portapapeles!');
        });
    };

    return (
        <>
            <div
                className="card"
                onClick={() => setIsModalOpen(true)}
                style={{ cursor: 'pointer' }}
            >
                <div className="card-image-wrapper">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="card-image"
                    />
                    <div className="card-category">
                        <Tag size={12} /> {article.category}
                    </div>
                </div>

                <div className="card-content">
                    <div className="card-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {article.readTime}
                        </span>
                        <span>•</span>
                        <span>{article.date}</span>
                    </div>

                    <h3 className="card-title">
                        {article.title}
                    </h3>

                    <p className="card-excerpt">
                        {article.excerpt}
                    </p>

                    <div className="card-footer">
                        <div className="author">
                            <img src={article.author.avatar} alt={article.author.name} className="author-img" />
                            <span className="author-name">{article.author.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="icon-btn"
                                onClick={handleShare}
                                title="Compartir"
                            >
                                <Share2 size={18} />
                            </button>
                            <button className="icon-btn">
                                <ArrowUpRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }} onClick={() => setIsModalOpen(false)}>
                    <div style={{
                        background: '#050507',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative',
                        padding: '2rem'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <img
                            src={article.image}
                            alt={article.title}
                            style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '2rem' }}
                        />

                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{article.title}</h2>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                            <div className="author" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img src={article.author.avatar} alt={article.author.name} className="author-img" />
                                <span className="author-name">{article.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>{article.date}</span>
                        </div>

                        <div style={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#e0e0e0' }}>
                            {article.content ? (
                                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            ) : (
                                <>
                                    <p style={{ marginBottom: '1.5rem' }}>{article.excerpt}</p>
                                    <p style={{ marginBottom: '1.5rem' }}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                    <p style={{ marginBottom: '1.5rem' }}>
                                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </p>
                                    <h3 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem', color: 'var(--primary)' }}>El Futuro es Ahora</h3>
                                    <p>
                                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ArticleCard;
