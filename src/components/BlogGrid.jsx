import React, { useState } from 'react';
import ArticleCard from './ArticleCard';
import articles from '../data/posts.json';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BlogGrid = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    // Calculate indexes for pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(articles.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            document.getElementById('latest').scrollIntoView({ behavior: 'smooth' });
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            document.getElementById('latest').scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="section" id="latest">
            <div className="container">
                <div className="grid-header">
                    <div>
                        <h2 className="grid-title">Últimas <span className="gradient-text">Perspectivas</span></h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '500px' }}>
                            Mantente a la vanguardia con nuestros artículos seleccionados sobre los desarrollos más importantes en el espacio blockchain.
                        </p>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Página {currentPage} de {totalPages}
                    </div>
                </div>

                <div className="articles-grid">
                    {currentPosts.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {articles.length > postsPerPage && (
                    <div className="pagination" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '3rem'
                    }}>
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="btn-outline"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: currentPage === 1 ? 0.5 : 1,
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                padding: '0.5rem 1rem'
                            }}
                        >
                            <ChevronLeft size={20} /> Anterior
                        </button>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => {
                                        paginate(i + 1);
                                        document.getElementById('latest').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                        borderRadius: '50%',
                                        border: currentPage === i + 1 ? '1px solid #00f3ff' : '1px solid rgba(255,255,255,0.1)',
                                        background: currentPage === i + 1 ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                                        color: currentPage === i + 1 ? '#00f3ff' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {i + 1}
                                </button>
                            )).slice(
                                Math.max(0, currentPage - 3),
                                Math.min(totalPages, currentPage + 2)
                            )}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="btn-outline"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: currentPage === totalPages ? 0.5 : 1,
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                padding: '0.5rem 1rem'
                            }}
                        >
                            Siguiente <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogGrid;
