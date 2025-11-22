import React from 'react';
import Hero from '../components/Hero';
import CryptoTicker from '../components/CryptoTicker';
import BlogGrid from '../components/BlogGrid';

const Home = () => {
    return (
        <main>
            <Hero />
            <CryptoTicker />
            <BlogGrid />
        </main>
    );
};

export default Home;
