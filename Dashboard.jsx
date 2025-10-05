import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState({});
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: user?.balance || 10000,
    dailyChange: 250.50,
    dailyChangePercent: 2.13,
    openTrades: 8,
    unrealizedPnL: 1250.50
  });

  useEffect(() => {
    // Initialize market data
    const initialData = {
      'AAPL': { price: 182.63, change: 1.25, changePercent: 0.69 },
      'GOOGL': { price: 138.21, change: -0.45, changePercent: -0.32 },
      'MSFT': { price: 337.79, change: 2.34, changePercent: 0.70 },
      'TSLA': { price: 248.50, change: -5.25, changePercent: -2.07 },
      'BTC/USD': { price: 43250, change: 1250, changePercent: 2.98 },
      'EUR/USD': { price: 1.0723, change: -0.0012, changePercent: -0.11 }
    };
    setMarketData(initialData);

    // Simulate live updates
    const interval = setInterval(() => {
      setMarketData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(symbol => {
          const randomChange = (Math.random() - 0.5) * 2;
          newData[symbol].price += randomChange;
          newData[symbol].change += randomChange;
          newData[symbol].changePercent = (newData[symbol].change / (newData[symbol].price - newData[symbol].change)) * 100;
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Portfolio Value', value: `$${portfolioStats.totalValue.toLocaleString()}`, change: portfolioStats.dailyChange },
    { label: 'Open Trades', value: portfolioStats.openTrades },
    { label: 'Unrealized P&L', value: `$${portfolioStats.unrealizedPnL}`, change: portfolioStats.unrealizedPnL },
    { label: 'Daily Change', value: `${portfolioStats.dailyChangePercent}%`, change: portfolioStats.dailyChange }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.fullName}!</h1>
        <p>Here's your trading overview</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            {stat.change !== undefined && (
              <div className={`stat-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                {stat.change >= 0 ? '+' : ''}{stat.change}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="market-overview">
          <h2>Live Markets</h2>
          <div className="market-grid">
            {Object.entries(marketData).map(([symbol, data]) => (
              <div key={symbol} className="market-card">
                <div className="symbol">{symbol}</div>
                <div className="price">${data.price.toFixed(2)}</div>
                <div className={`change ${data.change >= 0 ? 'positive' : 'negative'}`}>
                  {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/trade" className="action-btn primary">
              New Trade
            </Link>
            <Link to="/analytics" className="action-btn secondary">
              View Analytics
            </Link>
            <Link to="/history" className="action-btn secondary">
              Trade History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;