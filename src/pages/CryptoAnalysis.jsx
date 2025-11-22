import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TradingViewWidget from '../components/TradingViewWidget';
import CryptoHeatmap from '../components/CryptoHeatmap';
import CryptoMarket from '../components/CryptoMarket';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import FundamentalData from '../components/FundamentalData';
import SingleTicker from '../components/SingleTicker';
import { TrendingUp, Activity, DollarSign, BarChart3 } from 'lucide-react';

const CryptoAnalysis = () => {
    const [globalData, setGlobalData] = useState(null);
    const [trending, setTrending] = useState([]);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const globalRes = await axios.get('https://api.coingecko.com/api/v3/global');
                setGlobalData(globalRes.data.data);

                const trendingRes = await axios.get('https://api.coingecko.com/api/v3/search/trending');
                setTrending(trendingRes.data.coins.slice(0, 4));
            } catch (error) {
                console.error('Error fetching analysis data:', error);
            }
        };

        fetchData();
    }, []);

    const topCoins = [
        "BINANCE:BTCUSDT",
        "BINANCE:ETHUSDT",
        "BINANCE:BNBUSDT",
        "BINANCE:SOLUSDT"
    ];

    return (
        <div className="analysis-page container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            {/* Enhanced Header with Info Button */}
            <header className="analysis-header" style={{
                marginBottom: '3rem',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.05) 0%, rgba(255, 0, 255, 0.05) 100%)',
                padding: '3rem',
                borderRadius: '20px',
                border: '1px solid rgba(0, 243, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 243, 255, 0.1)'
            }}>
                <button
                    onClick={() => setShowInfoModal(true)}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'rgba(0, 243, 255, 0.1)',
                        border: '1px solid rgba(0, 243, 255, 0.3)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        color: '#00f3ff',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 243, 255, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 243, 255, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="Información sobre las métricas"
                >
                    ?
                </button>

                <h1 style={{
                    fontSize: '3.5rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #00f3ff 0%, #ff00ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '800',
                    letterSpacing: '-0.02em'
                }}>
                    Crypto Market Dashboard
                </h1>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.3rem',
                    fontWeight: '300',
                    maxWidth: '800px'
                }}>
                    Análisis en tiempo real, gráficos profesionales y tendencias del mercado global.
                </p>
            </header>

            {/* Enhanced Global Metrics Grid */}
            <div className="metrics-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {/* Market Cap Card */}
                <div className="metric-card card" style={{
                    background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.05) 0%, rgba(0, 243, 255, 0.02) 100%)',
                    border: '1px solid rgba(0, 243, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '1.5rem'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 243, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}>
                    {/* Info Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            alert('Market Cap Global\n\nEs el valor total de todas las criptomonedas en circulación. Se calcula multiplicando el precio actual de cada moneda por su suministro circulante. Un market cap alto indica un mercado más maduro y estable.');
                        }}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(0, 243, 255, 0.1)',
                            border: '1px solid rgba(0, 243, 255, 0.3)',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            color: '#00f3ff',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            padding: 0
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 243, 255, 0.2)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 243, 255, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        ?
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="icon-box" style={{
                            background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.2) 0%, rgba(0, 243, 255, 0.1) 100%)',
                            padding: '12px',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0, 243, 255, 0.3)'
                        }}>
                            <DollarSign color="#00f3ff" size={28} />
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Market Cap Global</span>
                    </div>
                    <h3 style={{
                        fontSize: '2.5rem',
                        marginBottom: '0.8rem',
                        fontWeight: '700',
                        color: '#00f3ff'
                    }}>
                        {globalData ? `$${(globalData.total_market_cap.usd / 1e12).toFixed(2)}T` : '...'}
                    </h3>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: globalData?.market_cap_change_percentage_24h_usd >= 0 ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        <span style={{ color: globalData?.market_cap_change_percentage_24h_usd >= 0 ? '#00ff9d' : '#ff0055' }}>
                            {globalData?.market_cap_change_percentage_24h_usd >= 0 ? '↑' : '↓'}
                        </span>
                        <span style={{ color: globalData?.market_cap_change_percentage_24h_usd >= 0 ? '#00ff9d' : '#ff0055' }}>
                            {Math.abs(globalData?.market_cap_change_percentage_24h_usd || 0).toFixed(2)}% (24h)
                        </span>
                    </div>
                </div>

                {/* Volume Card */}
                <div className="metric-card card" style={{
                    background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.05) 0%, rgba(255, 0, 255, 0.02) 100%)',
                    border: '1px solid rgba(255, 0, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '1.5rem'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 0, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}>
                    {/* Info Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            alert('Volumen 24h\n\nRepresenta el valor total de todas las transacciones realizadas en las últimas 24 horas. Un volumen alto indica mayor actividad de trading y liquidez en el mercado.');
                        }}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(255, 0, 255, 0.1)',
                            border: '1px solid rgba(255, 0, 255, 0.3)',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            color: '#ff00ff',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            padding: 0
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 0, 255, 0.2)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 0, 255, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        ?
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="icon-box" style={{
                            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(255, 0, 255, 0.1) 100%)',
                            padding: '12px',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(255, 0, 255, 0.3)'
                        }}>
                            <Activity color="#ff00ff" size={28} />
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Volumen 24h</span>
                    </div>
                    <h3 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: '#ff00ff'
                    }}>
                        {globalData ? `$${(globalData.total_volume.usd / 1e9).toFixed(2)}B` : '...'}
                    </h3>
                </div>

                {/* BTC Dominance Card */}
                <div className="metric-card card" style={{
                    background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.05) 0%, rgba(255, 165, 0, 0.02) 100%)',
                    border: '1px solid rgba(255, 165, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '1.5rem'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 165, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}>
                    {/* Info Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            alert('Dominancia BTC\n\nMuestra el porcentaje del market cap total que representa Bitcoin. Una dominancia alta (>50%) indica que Bitcoin lidera el mercado. Cuando baja, sugiere que las altcoins están ganando terreno.');
                        }}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(255, 165, 0, 0.1)',
                            border: '1px solid rgba(255, 165, 0, 0.3)',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            color: 'orange',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            padding: 0
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 165, 0, 0.2)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        ?
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="icon-box" style={{
                            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.2) 0%, rgba(255, 165, 0, 0.1) 100%)',
                            padding: '12px',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(255, 165, 0, 0.3)'
                        }}>
                            <BarChart3 color="orange" size={28} />
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Dominancia BTC</span>
                    </div>
                    <h3 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: 'orange'
                    }}>
                        {globalData ? `${globalData.market_cap_percentage.btc.toFixed(1)}%` : '...'}
                    </h3>
                </div>
            </div>

            {/* Info Modal */}
            {showInfoModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 3000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }} onClick={() => setShowInfoModal(false)}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(5, 5, 7, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%)',
                        border: '1px solid rgba(0, 243, 255, 0.3)',
                        borderRadius: '20px',
                        maxWidth: '600px',
                        width: '100%',
                        padding: '2.5rem',
                        position: 'relative',
                        boxShadow: '0 20px 60px rgba(0, 243, 255, 0.3)'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowInfoModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                color: '#00f3ff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>

                        <h2 style={{
                            fontSize: '2rem',
                            marginBottom: '2rem',
                            background: 'linear-gradient(135deg, #00f3ff 0%, #ff00ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            📊 Guía de Métricas
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <h3 style={{ color: '#00f3ff', marginBottom: '0.5rem', fontSize: '1.2rem' }}>💰 Market Cap Global</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Es el valor total de todas las criptomonedas en circulación. Se calcula multiplicando el precio actual de cada moneda por su suministro circulante. Un market cap alto indica un mercado más maduro y estable.
                                </p>
                            </div>

                            <div>
                                <h3 style={{ color: '#ff00ff', marginBottom: '0.5rem', fontSize: '1.2rem' }}>📈 Volumen 24h</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Representa el valor total de todas las transacciones realizadas en las últimas 24 horas. Un volumen alto indica mayor actividad de trading y liquidez en el mercado.
                                </p>
                            </div>

                            <div>
                                <h3 style={{ color: 'orange', marginBottom: '0.5rem', fontSize: '1.2rem' }}>₿ Dominancia BTC</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Muestra el porcentaje del market cap total que representa Bitcoin. Una dominancia alta (&gt;50%) indica que Bitcoin lidera el mercado. Cuando baja, sugiere que las altcoins están ganando terreno.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Single Tickers - Top Coins */}
            <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>📊 Principales Criptomonedas</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '3rem'
            }}>
                {topCoins.map((symbol) => (
                    <div key={symbol} style={{ height: '120px' }}>
                        <SingleTicker symbol={symbol} />
                    </div>
                ))}
            </div>

            {/* Main Chart Section */}
            <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>📈 Gráfico Avanzado</h2>
            <div className="chart-section card" style={{ height: '600px', padding: '0', overflow: 'hidden', marginBottom: '3rem' }}>
                <TradingViewWidget />
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>🔍 Análisis Técnico</h2>
                    <div className="card" style={{ height: '500px', padding: '0', overflow: 'hidden' }}>
                        <TechnicalAnalysis />
                    </div>
                </div>

                <div>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>📊 Datos Fundamentales (BTC)</h2>
                    <div className="card" style={{ height: '500px', padding: '0', overflow: 'hidden' }}>
                        <FundamentalData />
                    </div>
                </div>
            </div>

            {/* Crypto Heatmap */}
            <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>🔥 Mapa de Calor del Mercado</h2>
            <div className="card" style={{ height: '600px', padding: '0', overflow: 'hidden', marginBottom: '3rem' }}>
                <CryptoHeatmap />
            </div>

            {/* Cryptocurrency Market Screener */}
            <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>💹 Mercado de Criptomonedas</h2>
            <div className="card" style={{ height: '600px', padding: '0', overflow: 'hidden', marginBottom: '3rem' }}>
                <CryptoMarket />
            </div>

            {/* Trending Section */}
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>🔥 Tendencias de Búsqueda</h2>
            <div className="trending-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
            }}>
                {trending.map((coin) => (
                    <div key={coin.item.id} className="card" style={{ textAlign: 'center' }}>
                        <img src={coin.item.small} alt={coin.item.name} style={{ width: '50px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{coin.item.name}</h4>
                        <span style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.9rem'
                        }}>
                            #{coin.item.market_cap_rank}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CryptoAnalysis;
