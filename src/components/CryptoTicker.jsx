import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CryptoTicker = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/coins/markets',
                    {
                        params: {
                            vs_currency: 'usd',
                            order: 'market_cap_desc',
                            per_page: 10,
                            page: 1,
                            sparkline: false,
                        },
                    }
                );
                setCoins(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
                setLoading(false);
            }
        };

        fetchPrices();
        // Refresh every 60 seconds
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return (
        <div className="crypto-ticker-container">
            <div className="ticker-track">
                {/* Duplicate the list to create seamless infinite scroll effect */}
                {[...coins, ...coins].map((coin, index) => (
                    <div key={`${coin.id}-${index}`} className="ticker-item">
                        <img src={coin.image} alt={coin.name} className="coin-icon" />
                        <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                        <span className="coin-price">${coin.current_price.toLocaleString()}</span>
                        <span className={`coin-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CryptoTicker;
