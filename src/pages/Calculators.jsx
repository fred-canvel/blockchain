import React, { useState } from 'react';
import { Calculator, TrendingUp, Repeat, Coins, DollarSign, PieChart, AlertTriangle, Percent } from 'lucide-react';

// Simple Chart Components
const BarChart = ({ data, label }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="chart-container">
            <h4 className="chart-title">{label}</h4>
            <div className="bar-chart">
                {data.map((item, index) => (
                    <div key={index} className="bar-item">
                        <div className="bar-wrapper">
                            <div
                                className="bar-fill"
                                style={{
                                    height: `${(item.value / maxValue) * 100}%`,
                                    background: item.color || 'linear-gradient(135deg, #a855f7, #ec4899)'
                                }}
                            >
                                <span className="bar-value">${item.value}</span>
                            </div>
                        </div>
                        <span className="bar-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PieChartComponent = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
        <div className="chart-container">
            <h4 className="chart-title">Distribución</h4>
            <div className="pie-chart-wrapper">
                <svg viewBox="0 0 200 200" className="pie-chart">
                    {data.map((item, index) => {
                        const percentage = (item.value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const startAngle = currentAngle;
                        currentAngle += angle;

                        const x1 = 100 + 90 * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = 100 + 90 * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = 100 + 90 * Math.cos((currentAngle - 90) * Math.PI / 180);
                        const y2 = 100 + 90 * Math.sin((currentAngle - 90) * Math.PI / 180);

                        const largeArc = angle > 180 ? 1 : 0;
                        const pathData = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill={item.color}
                                className="pie-slice"
                            />
                        );
                    })}
                </svg>
                <div className="pie-legend">
                    {data.map((item, index) => (
                        <div key={index} className="legend-item">
                            <div className="legend-color" style={{ background: item.color }}></div>
                            <span className="legend-label">{item.label}: ${item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const LineChart = ({ data, label }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((item.value / maxValue) * 80);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="chart-container">
            <h4 className="chart-title">{label}</h4>
            <svg viewBox="0 0 100 100" className="line-chart" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                <polygon
                    points={`0,100 ${points} 100,100`}
                    fill="url(#lineGradient)"
                />
                <polyline
                    points={points}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="0.5"
                />
                {data.map((item, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = 100 - ((item.value / maxValue) * 80);
                    return (
                        <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="1"
                            fill="#a855f7"
                            className="chart-point"
                        />
                    );
                })}
            </svg>
            <div className="chart-labels">
                {data.map((item, index) => (
                    <span key={index} className="chart-label-item">{item.label}</span>
                ))}
            </div>
        </div>
    );
};

const CryptoCalculators = () => {
    const [activeCalculator, setActiveCalculator] = useState('roi');

    // ROI Calculator State
    const [investment, setInvestment] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [roiResult, setRoiResult] = useState(null);

    // Converter State
    const [cryptoAmount, setCryptoAmount] = useState('');
    const [cryptoPrice, setCryptoPrice] = useState('');
    const [conversionResult, setConversionResult] = useState(null);

    // Staking Calculator State
    const [stakingAmount, setStakingAmount] = useState('');
    const [stakingAPY, setStakingAPY] = useState('');
    const [stakingDays, setStakingDays] = useState('365');
    const [stakingResult, setStakingResult] = useState(null);

    // DCA Calculator State
    const [dcaAmount, setDcaAmount] = useState('');
    const [dcaFrequency, setDcaFrequency] = useState('weekly');
    const [dcaPeriod, setDcaPeriod] = useState('12');
    const [dcaResult, setDcaResult] = useState(null);

    // Liquidation Calculator State
    const [entryPrice, setEntryPrice] = useState('');
    const [leverage, setLeverage] = useState('10');
    const [positionSize, setPositionSize] = useState('');
    const [positionType, setPositionType] = useState('long');
    const [liquidationResult, setLiquidationResult] = useState(null);

    // Compound Interest Calculator State
    const [principal, setPrincipal] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [timePeriod, setTimePeriod] = useState('');
    const [compoundFrequency, setCompoundFrequency] = useState('12'); // monthly
    const [monthlyContribution, setMonthlyContribution] = useState('0');
    const [compoundResult, setCompoundResult] = useState(null);

    // ROI Calculator Logic
    const calculateROI = () => {
        const inv = parseFloat(investment);
        const buy = parseFloat(buyPrice);
        const sell = parseFloat(sellPrice);

        if (inv && buy && sell) {
            const coins = inv / buy;
            const finalValue = coins * sell;
            const profit = finalValue - inv;
            const roiPercentage = ((profit / inv) * 100).toFixed(2);

            setRoiResult({
                coins: coins.toFixed(8),
                finalValue: finalValue.toFixed(2),
                profit: profit.toFixed(2),
                roiPercentage: roiPercentage,
                isProfit: profit > 0
            });
        }
    };

    // Converter Logic
    const convertCrypto = () => {
        const amount = parseFloat(cryptoAmount);
        const price = parseFloat(cryptoPrice);

        if (amount && price) {
            const usdValue = amount * price;
            setConversionResult({
                usdValue: usdValue.toFixed(2),
                amount: amount,
                price: price
            });
        }
    };

    // Staking Calculator Logic
    const calculateStaking = () => {
        const amount = parseFloat(stakingAmount);
        const apy = parseFloat(stakingAPY);
        const days = parseFloat(stakingDays);

        if (amount && apy && days) {
            const dailyRate = apy / 100 / 365;
            const finalAmount = amount * Math.pow(1 + dailyRate, days);
            const rewards = finalAmount - amount;

            setStakingResult({
                finalAmount: finalAmount.toFixed(2),
                rewards: rewards.toFixed(2),
                dailyRewards: (rewards / days).toFixed(4),
                amount: amount,
                apy: apy,
                days: days
            });
        }
    };

    // DCA Calculator Logic
    const calculateDCA = () => {
        const amount = parseFloat(dcaAmount);
        const period = parseFloat(dcaPeriod);

        if (amount && period) {
            const frequencies = {
                daily: 365,
                weekly: 52,
                biweekly: 26,
                monthly: 12
            };

            const investmentsPerYear = frequencies[dcaFrequency];
            const totalInvestments = (investmentsPerYear / 12) * period;
            const totalInvested = amount * totalInvestments;

            setDcaResult({
                totalInvested: totalInvested.toFixed(2),
                numberOfInvestments: Math.floor(totalInvestments),
                perInvestment: amount.toFixed(2),
                amount: amount,
                period: period
            });
        }
    };

    // Liquidation Calculator Logic
    const calculateLiquidation = () => {
        const entry = parseFloat(entryPrice);
        const lev = parseFloat(leverage);
        const size = parseFloat(positionSize);

        if (entry && lev && size) {
            // Maintenance margin rate (typically 0.4% for most exchanges)
            const maintenanceMarginRate = 0.004;

            let liquidationPrice;
            if (positionType === 'long') {
                // Long position: Liquidation Price = Entry Price × (1 - 1/Leverage + Maintenance Margin Rate)
                liquidationPrice = entry * (1 - (1 / lev) + maintenanceMarginRate);
            } else {
                // Short position: Liquidation Price = Entry Price × (1 + 1/Leverage - Maintenance Margin Rate)
                liquidationPrice = entry * (1 + (1 / lev) - maintenanceMarginRate);
            }

            const distanceToLiquidation = Math.abs(((liquidationPrice - entry) / entry) * 100);
            const initialMargin = size / lev;
            const maintenanceMargin = size * maintenanceMarginRate;

            // Calculate PnL at different price points
            const priceScenarios = [];
            const step = entry * 0.05; // 5% steps
            for (let i = -3; i <= 3; i++) {
                const price = entry + (step * i);
                let pnl;
                if (positionType === 'long') {
                    pnl = ((price - entry) / entry) * size;
                } else {
                    pnl = ((entry - price) / entry) * size;
                }
                const pnlPercentage = (pnl / initialMargin) * 100;
                priceScenarios.push({
                    price: price.toFixed(2),
                    pnl: pnl.toFixed(2),
                    pnlPercentage: pnlPercentage.toFixed(2)
                });
            }

            // Risk level based on distance to liquidation
            let riskLevel = 'low';
            let riskColor = '#10b981';
            if (distanceToLiquidation < 5) {
                riskLevel = 'extreme';
                riskColor = '#dc2626';
            } else if (distanceToLiquidation < 10) {
                riskLevel = 'high';
                riskColor = '#f59e0b';
            } else if (distanceToLiquidation < 20) {
                riskLevel = 'medium';
                riskColor = '#eab308';
            }

            setLiquidationResult({
                liquidationPrice: liquidationPrice.toFixed(2),
                distanceToLiquidation: distanceToLiquidation.toFixed(2),
                initialMargin: initialMargin.toFixed(2),
                maintenanceMargin: maintenanceMargin.toFixed(2),
                priceScenarios: priceScenarios,
                riskLevel: riskLevel,
                riskColor: riskColor,
                entry: entry,
                leverage: lev
            });
        }
    };

    // Compound Interest Calculator Logic
    const calculateCompoundInterest = () => {
        const p = parseFloat(principal);
        const r = parseFloat(interestRate) / 100;
        const t = parseFloat(timePeriod);
        const n = parseFloat(compoundFrequency);
        const pmt = parseFloat(monthlyContribution);

        if (p && r && t && n) {
            // Compound interest formula: A = P(1 + r/n)^(nt)
            const compoundAmount = p * Math.pow(1 + r / n, n * t);

            // Future value with monthly contributions
            let futureValue = compoundAmount;
            if (pmt > 0) {
                // FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
                const contributionValue = pmt * 12 * (Math.pow(1 + r / n, n * t) - 1) / (r / n);
                futureValue = compoundAmount + contributionValue;
            }

            const totalContributions = p + (pmt * 12 * t);
            const totalInterest = futureValue - totalContributions;

            // Calculate year-by-year growth
            const yearlyGrowth = [];
            for (let year = 1; year <= Math.min(t, 20); year++) {
                const yearAmount = p * Math.pow(1 + r / n, n * year);
                let yearValue = yearAmount;
                if (pmt > 0) {
                    const yearContributions = pmt * 12 * (Math.pow(1 + r / n, n * year) - 1) / (r / n);
                    yearValue = yearAmount + yearContributions;
                }
                yearlyGrowth.push({
                    year: year,
                    value: parseFloat(yearValue.toFixed(2)),
                    label: `Año ${year}`
                });
            }

            setCompoundResult({
                futureValue: futureValue.toFixed(2),
                totalContributions: totalContributions.toFixed(2),
                totalInterest: totalInterest.toFixed(2),
                effectiveRate: ((futureValue / totalContributions - 1) * 100).toFixed(2),
                yearlyGrowth: yearlyGrowth,
                principal: p,
                rate: r * 100,
                years: t
            });
        }
    };

    // Generate chart data for staking
    const getStakingChartData = () => {
        if (!stakingResult) return [];

        const data = [];
        const amount = parseFloat(stakingAmount);
        const apy = parseFloat(stakingAPY);
        const days = parseFloat(stakingDays);
        const intervals = 12;
        const daysPerInterval = days / intervals;

        for (let i = 0; i <= intervals; i++) {
            const currentDays = i * daysPerInterval;
            const dailyRate = apy / 100 / 365;
            const value = amount * Math.pow(1 + dailyRate, currentDays);
            data.push({
                label: `${Math.round(currentDays)}d`,
                value: parseFloat(value.toFixed(2))
            });
        }

        return data;
    };

    // Generate chart data for DCA
    const getDCAChartData = () => {
        if (!dcaResult) return [];

        const data = [];
        const amount = parseFloat(dcaAmount);
        const period = parseFloat(dcaPeriod);
        const intervals = Math.min(period, 12);

        for (let i = 1; i <= intervals; i++) {
            const frequencies = {
                daily: 365,
                weekly: 52,
                biweekly: 26,
                monthly: 12
            };

            const investmentsPerYear = frequencies[dcaFrequency];
            const totalInvestments = (investmentsPerYear / 12) * i;
            const totalInvested = amount * totalInvestments;

            data.push({
                label: `M${i}`,
                value: parseFloat(totalInvested.toFixed(2))
            });
        }

        return data;
    };

    const calculators = [
        { id: 'roi', name: 'ROI', icon: TrendingUp },
        { id: 'converter', name: 'Conversor', icon: Repeat },
        { id: 'staking', name: 'Staking', icon: Coins },
        { id: 'dca', name: 'DCA', icon: DollarSign },
        { id: 'liquidation', name: 'Liquidación', icon: AlertTriangle },
        { id: 'compound', name: 'Interés Compuesto', icon: Percent }
    ];

    return (
        <div className="calculators-page">
            <div className="container">
                {/* Header */}
                <div className="calculators-header">
                    <div className="calculators-header-icon">
                        <Calculator size={48} color="#a855f7" />
                        <h1 className="calculators-title">Calculadoras Crypto</h1>
                    </div>
                    <p className="calculators-subtitle">
                        Herramientas profesionales con visualización de datos para calcular ROI, conversiones, staking y estrategias DCA
                    </p>
                </div>

                {/* Calculator Tabs */}
                <div className="calculator-tabs">
                    {calculators.map((calc) => {
                        const Icon = calc.icon;
                        return (
                            <button
                                key={calc.id}
                                onClick={() => setActiveCalculator(calc.id)}
                                className={`calculator-tab ${activeCalculator === calc.id ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                {calc.name}
                            </button>
                        );
                    })}
                </div>

                {/* Calculator Content */}
                <div className="calculator-content">
                    {/* ROI Calculator */}
                    {activeCalculator === 'roi' && (
                        <div className="calculator-form">
                            <h2 className="calculator-section-title">Calculadora de ROI</h2>

                            <div className="calculator-grid">
                                <div className="form-group">
                                    <label className="form-label">Inversión Inicial (USD)</label>
                                    <input
                                        type="number"
                                        value={investment}
                                        onChange={(e) => setInvestment(e.target.value)}
                                        placeholder="1000"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Precio de Compra (USD)</label>
                                    <input
                                        type="number"
                                        value={buyPrice}
                                        onChange={(e) => setBuyPrice(e.target.value)}
                                        placeholder="50000"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Precio de Venta (USD)</label>
                                    <input
                                        type="number"
                                        value={sellPrice}
                                        onChange={(e) => setSellPrice(e.target.value)}
                                        placeholder="60000"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <button onClick={calculateROI} className="btn-calculate">
                                Calcular ROI
                            </button>

                            {roiResult && (
                                <>
                                    <div className="results-grid">
                                        <div className="result-card">
                                            <p className="result-label">Monedas Adquiridas</p>
                                            <p className="result-value">{roiResult.coins}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Valor Final</p>
                                            <p className="result-value">${roiResult.finalValue}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Ganancia/Pérdida</p>
                                            <p className={`result-value ${roiResult.isProfit ? 'positive' : 'negative'}`}>
                                                ${roiResult.profit}
                                            </p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">ROI</p>
                                            <p className={`result-value ${roiResult.isProfit ? 'positive' : 'negative'}`}>
                                                {roiResult.roiPercentage}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className="charts-grid">
                                        <BarChart
                                            data={[
                                                { label: 'Inversión', value: parseFloat(investment), color: '#6366f1' },
                                                { label: 'Valor Final', value: parseFloat(roiResult.finalValue), color: roiResult.isProfit ? '#10b981' : '#ef4444' }
                                            ]}
                                            label="Comparación de Valores"
                                        />
                                        <PieChartComponent
                                            data={[
                                                { label: 'Inversión Inicial', value: parseFloat(investment), color: '#6366f1' },
                                                { label: roiResult.isProfit ? 'Ganancia' : 'Pérdida', value: Math.abs(parseFloat(roiResult.profit)), color: roiResult.isProfit ? '#10b981' : '#ef4444' }
                                            ]}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Converter */}
                    {activeCalculator === 'converter' && (
                        <div className="calculator-form">
                            <h2 className="calculator-section-title">Conversor de Criptomonedas</h2>

                            <div className="calculator-grid">
                                <div className="form-group">
                                    <label className="form-label">Cantidad de Crypto</label>
                                    <input
                                        type="number"
                                        value={cryptoAmount}
                                        onChange={(e) => setCryptoAmount(e.target.value)}
                                        placeholder="1.5"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Precio por Unidad (USD)</label>
                                    <input
                                        type="number"
                                        value={cryptoPrice}
                                        onChange={(e) => setCryptoPrice(e.target.value)}
                                        placeholder="50000"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <button onClick={convertCrypto} className="btn-calculate">
                                Convertir
                            </button>

                            {conversionResult && (
                                <>
                                    <div className="result-highlight">
                                        <p className="result-label">Valor Total en USD</p>
                                        <p className="result-value">${conversionResult.usdValue}</p>
                                        <p className="result-detail">
                                            {conversionResult.amount} × ${conversionResult.price}
                                        </p>
                                    </div>

                                    <div className="charts-grid">
                                        <BarChart
                                            data={[
                                                { label: 'Precio Unitario', value: parseFloat(cryptoPrice), color: '#a855f7' },
                                                { label: 'Valor Total', value: parseFloat(conversionResult.usdValue), color: '#ec4899' }
                                            ]}
                                            label="Desglose de Conversión"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Staking Calculator */}
                    {activeCalculator === 'staking' && (
                        <div className="calculator-form">
                            <h2 className="calculator-section-title">Calculadora de Staking</h2>

                            <div className="calculator-grid">
                                <div className="form-group">
                                    <label className="form-label">Cantidad a Stakear</label>
                                    <input
                                        type="number"
                                        value={stakingAmount}
                                        onChange={(e) => setStakingAmount(e.target.value)}
                                        placeholder="1000"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">APY (%)</label>
                                    <input
                                        type="number"
                                        value={stakingAPY}
                                        onChange={(e) => setStakingAPY(e.target.value)}
                                        placeholder="12"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Días de Staking</label>
                                    <input
                                        type="number"
                                        value={stakingDays}
                                        onChange={(e) => setStakingDays(e.target.value)}
                                        placeholder="365"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <button onClick={calculateStaking} className="btn-calculate">
                                Calcular Recompensas
                            </button>

                            {stakingResult && (
                                <>
                                    <div className="results-grid">
                                        <div className="result-card">
                                            <p className="result-label">Monto Final</p>
                                            <p className="result-value">${stakingResult.finalAmount}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Recompensas Totales</p>
                                            <p className="result-value positive">${stakingResult.rewards}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Recompensa Diaria</p>
                                            <p className="result-value purple">${stakingResult.dailyRewards}</p>
                                        </div>
                                    </div>

                                    <div className="charts-grid">
                                        <LineChart
                                            data={getStakingChartData()}
                                            label="Crecimiento del Staking en el Tiempo"
                                        />
                                        <PieChartComponent
                                            data={[
                                                { label: 'Capital Inicial', value: parseFloat(stakingAmount), color: '#6366f1' },
                                                { label: 'Recompensas', value: parseFloat(stakingResult.rewards), color: '#10b981' }
                                            ]}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* DCA Calculator */}
                    {activeCalculator === 'dca' && (
                        <div className="calculator-form">
                            <h2 className="calculator-section-title">Calculadora DCA (Dollar Cost Averaging)</h2>

                            <div className="calculator-grid">
                                <div className="form-group">
                                    <label className="form-label">Monto por Inversión (USD)</label>
                                    <input
                                        type="number"
                                        value={dcaAmount}
                                        onChange={(e) => setDcaAmount(e.target.value)}
                                        placeholder="100"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Frecuencia</label>
                                    <select
                                        value={dcaFrequency}
                                        onChange={(e) => setDcaFrequency(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="daily">Diario</option>
                                        <option value="weekly">Semanal</option>
                                        <option value="biweekly">Quincenal</option>
                                        <option value="monthly">Mensual</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Período (Meses)</label>
                                    <input
                                        type="number"
                                        value={dcaPeriod}
                                        onChange={(e) => setDcaPeriod(e.target.value)}
                                        placeholder="12"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <button onClick={calculateDCA} className="btn-calculate">
                                Calcular DCA
                            </button>

                            {dcaResult && (
                                <>
                                    <div className="results-grid">
                                        <div className="result-card">
                                            <p className="result-label">Total Invertido</p>
                                            <p className="result-value">${dcaResult.totalInvested}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Número de Inversiones</p>
                                            <p className="result-value purple">{dcaResult.numberOfInvestments}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Por Inversión</p>
                                            <p className="result-value positive">${dcaResult.perInvestment}</p>
                                        </div>
                                    </div>

                                    <div className="charts-grid">
                                        <LineChart
                                            data={getDCAChartData()}
                                            label="Acumulación de Capital DCA"
                                        />
                                        <BarChart
                                            data={getDCAChartData().slice(-6)}
                                            label="Últimos 6 Meses"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Liquidation Calculator */}
                    {activeCalculator === 'liquidation' && (
                        <div className="calculator-form">
                            <h2 className="calculator-section-title">Calculadora de Liquidación</h2>

                            <div className="calculator-grid">
                                <div className="form-group">
                                    <label className="form-label">Precio de Entrada (USD)</label>
                                    <input
                                        type="number"
                                        value={entryPrice}
                                        onChange={(e) => setEntryPrice(e.target.value)}
                                        placeholder="50000"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Apalancamiento (x)</label>
                                    <select
                                        value={leverage}
                                        onChange={(e) => setLeverage(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="2">2x</option>
                                        <option value="5">5x</option>
                                        <option value="10">10x</option>
                                        <option value="20">20x</option>
                                        <option value="50">50x</option>
                                        <option value="100">100x</option>
                                        <option value="125">125x</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tamaño de Posición (USD)</label>
                                    <input
                                        type="number"
                                        value={positionSize}
                                        onChange={(e) => setPositionSize(e.target.value)}
                                        placeholder="1000"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tipo de Posición</label>
                                    <select
                                        value={positionType}
                                        onChange={(e) => setPositionType(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="long">Long (Compra)</option>
                                        <option value="short">Short (Venta)</option>
                                    </select>
                                </div>
                            </div>

                            <button onClick={calculateLiquidation} className="btn-calculate">
                                Calcular Precio de Liquidación
                            </button>

                            {liquidationResult && (
                                <>
                                    {/* Risk Alert */}
                                    <div
                                        className="liquidation-alert"
                                        style={{
                                            background: `linear-gradient(135deg, ${liquidationResult.riskColor}20, ${liquidationResult.riskColor}10)`,
                                            borderColor: liquidationResult.riskColor
                                        }}
                                    >
                                        <AlertTriangle size={32} color={liquidationResult.riskColor} />
                                        <div>
                                            <h4 style={{ color: liquidationResult.riskColor }}>
                                                Nivel de Riesgo: {liquidationResult.riskLevel.toUpperCase()}
                                            </h4>
                                            <p>Distancia a liquidación: {liquidationResult.distanceToLiquidation}%</p>
                                        </div>
                                    </div>

                                    <div className="results-grid">
                                        <div className="result-card">
                                            <p className="result-label">Precio de Liquidación</p>
                                            <p className="result-value negative">${liquidationResult.liquidationPrice}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Distancia a Liquidación</p>
                                            <p className="result-value" style={{ color: liquidationResult.riskColor }}>
                                                {liquidationResult.distanceToLiquidation}%
                                            </p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Margen Inicial</p>
                                            <p className="result-value">${liquidationResult.initialMargin}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Margen de Mantenimiento</p>
                                            <p className="result-value purple">${liquidationResult.maintenanceMargin}</p>
                                        </div>
                                    </div>

                                    {/* Risk Gauge */}
                                    <div className="risk-gauge-container">
                                        <h4 className="chart-title">Indicador de Riesgo</h4>
                                        <div className="risk-gauge">
                                            <div className="risk-zones">
                                                <div className="risk-zone safe">Seguro</div>
                                                <div className="risk-zone medium">Medio</div>
                                                <div className="risk-zone high">Alto</div>
                                                <div className="risk-zone extreme">Extremo</div>
                                            </div>
                                            <div
                                                className="risk-indicator"
                                                style={{
                                                    left: `${Math.min(100 - parseFloat(liquidationResult.distanceToLiquidation) * 2, 95)}%`,
                                                    background: liquidationResult.riskColor
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Price Scenarios Table */}
                                    <div className="scenarios-table-container">
                                        <h4 className="chart-title">Escenarios de Precio</h4>
                                        <div className="scenarios-table">
                                            <div className="table-header">
                                                <span>Precio</span>
                                                <span>PnL (USD)</span>
                                                <span>PnL (%)</span>
                                            </div>
                                            {liquidationResult.priceScenarios.map((scenario, index) => (
                                                <div
                                                    key={index}
                                                    className={`table-row ${parseFloat(scenario.pnl) > 0 ? 'profit' : parseFloat(scenario.pnl) < 0 ? 'loss' : ''}`}
                                                >
                                                    <span>${scenario.price}</span>
                                                    <span>${scenario.pnl}</span>
                                                    <span>{scenario.pnlPercentage}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Charts */}
                                    <div className="charts-grid">
                                        <BarChart
                                            data={liquidationResult.priceScenarios.map(s => ({
                                                label: `$${s.price}`,
                                                value: Math.abs(parseFloat(s.pnl)),
                                                color: parseFloat(s.pnl) > 0 ? '#10b981' : '#ef4444'
                                            }))}
                                            label="PnL por Escenario de Precio"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Compound Interest Calculator */}
                    {activeCalculator === 'compound' && (
                        <div className="calculator-form">
                            <h2 className="calculator-section-title">Calculadora de Interés Compuesto</h2>

                            <div className="calculator-grid">
                                <div className="form-group">
                                    <label className="form-label">Capital Inicial (USD)</label>
                                    <input
                                        type="number"
                                        value={principal}
                                        onChange={(e) => setPrincipal(e.target.value)}
                                        placeholder="10000"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tasa de Interés Anual (%)</label>
                                    <input
                                        type="number"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(e.target.value)}
                                        placeholder="8"
                                        className="form-input"
                                        step="0.1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Período (Años)</label>
                                    <input
                                        type="number"
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(e.target.value)}
                                        placeholder="10"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Frecuencia de Capitalización</label>
                                    <select
                                        value={compoundFrequency}
                                        onChange={(e) => setCompoundFrequency(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="1">Anual</option>
                                        <option value="2">Semestral</option>
                                        <option value="4">Trimestral</option>
                                        <option value="12">Mensual</option>
                                        <option value="365">Diaria</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Contribución Mensual (USD)</label>
                                    <input
                                        type="number"
                                        value={monthlyContribution}
                                        onChange={(e) => setMonthlyContribution(e.target.value)}
                                        placeholder="0"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <button onClick={calculateCompoundInterest} className="btn-calculate">
                                Calcular Interés Compuesto
                            </button>

                            {compoundResult && (
                                <>
                                    <div className="result-highlight">
                                        <p className="result-label">Valor Futuro</p>
                                        <p className="result-value">${compoundResult.futureValue}</p>
                                        <p className="result-detail">
                                            Crecimiento del {compoundResult.effectiveRate}% sobre tu inversión total
                                        </p>
                                    </div>

                                    <div className="results-grid">
                                        <div className="result-card">
                                            <p className="result-label">Total Contribuido</p>
                                            <p className="result-value">${compoundResult.totalContributions}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Interés Ganado</p>
                                            <p className="result-value positive">${compoundResult.totalInterest}</p>
                                        </div>
                                        <div className="result-card">
                                            <p className="result-label">Tasa Efectiva</p>
                                            <p className="result-value purple">{compoundResult.effectiveRate}%</p>
                                        </div>
                                    </div>

                                    {/* Growth Chart */}
                                    <div className="charts-grid">
                                        <LineChart
                                            data={compoundResult.yearlyGrowth}
                                            label="Crecimiento del Capital en el Tiempo"
                                        />
                                        <PieChartComponent
                                            data={[
                                                { label: 'Capital Inicial', value: parseFloat(compoundResult.principal), color: '#6366f1' },
                                                { label: 'Contribuciones', value: parseFloat(compoundResult.totalContributions) - parseFloat(compoundResult.principal), color: '#a855f7' },
                                                { label: 'Interés Ganado', value: parseFloat(compoundResult.totalInterest), color: '#10b981' }
                                            ]}
                                        />
                                    </div>

                                    {/* Year-by-Year Table */}
                                    <div className="scenarios-table-container">
                                        <h4 className="chart-title">Crecimiento Año por Año</h4>
                                        <div className="scenarios-table">
                                            <div className="table-header">
                                                <span>Año</span>
                                                <span>Valor</span>
                                                <span>Crecimiento</span>
                                            </div>
                                            {compoundResult.yearlyGrowth.map((year, index) => {
                                                const previousValue = index > 0 ? compoundResult.yearlyGrowth[index - 1].value : parseFloat(compoundResult.principal);
                                                const growth = ((year.value - previousValue) / previousValue * 100).toFixed(2);
                                                return (
                                                    <div key={index} className="table-row profit">
                                                        <span>Año {year.year}</span>
                                                        <span>${year.value.toLocaleString()}</span>
                                                        <span>+{growth}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Info Cards */}
                <div className="info-cards">
                    <div className="info-card">
                        <TrendingUp className="info-card-icon" size={32} />
                        <h3 className="info-card-title">ROI Calculator</h3>
                        <p className="info-card-desc">Calcula el retorno de inversión de tus operaciones crypto con gráficas comparativas</p>
                    </div>

                    <div className="info-card">
                        <Repeat className="info-card-icon" size={32} />
                        <h3 className="info-card-title">Conversor</h3>
                        <p className="info-card-desc">Convierte entre criptomonedas y monedas fiat con visualización de datos</p>
                    </div>

                    <div className="info-card">
                        <Coins className="info-card-icon" size={32} />
                        <h3 className="info-card-title">Staking</h3>
                        <p className="info-card-desc">Visualiza el crecimiento de tus recompensas de staking en el tiempo</p>
                    </div>

                    <div className="info-card">
                        <DollarSign className="info-card-icon" size={32} />
                        <h3 className="info-card-title">DCA Strategy</h3>
                        <p className="info-card-desc">Planifica tu estrategia de inversión periódica con proyecciones gráficas</p>
                    </div>

                    <div className="info-card">
                        <AlertTriangle className="info-card-icon" size={32} />
                        <h3 className="info-card-title">Liquidación</h3>
                        <p className="info-card-desc">Calcula el precio de liquidación y gestiona el riesgo en trading apalancado</p>
                    </div>

                    <div className="info-card">
                        <Percent className="info-card-icon" size={32} />
                        <h3 className="info-card-title">Interés Compuesto</h3>
                        <p className="info-card-desc">Proyecta el crecimiento de tus inversiones con interés compuesto y contribuciones regulares</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CryptoCalculators;
