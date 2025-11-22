import React from 'react';
import ArticleCard from './ArticleCard';
import articles from '../data/posts.json';

const BlogGrid = () => {
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
                    <button className="btn-outline" style={{ display: 'none' }}>
                        Ver Todos los Posts
                    </button>
                </div>

                <div className="articles-grid">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogGrid;
