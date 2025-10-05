import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

function Analytics() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [tradeAnalytics, setTradeAnalytics] = useState({});
  const [assetAllocation, setAssetAllocation] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [timeframe, setTimeframe] = useState('1m');

  useEffect(() => {
    // Mock portfolio history data
    const mockPortfolioData = [
      { date: 'Jan 1', balance: 10000 },
      { date: 'Jan 2', balance: 10250 },
      { date: 'Jan 3', balance: 10100 },
      { date: 'Jan 4', balance: 10500 },
      { date: 'Jan 5', balance: 11250 },
      { date: 'Jan 6', balance: 11000 },
      { date: 'Jan 7', balance: 11500 },
      { date: 'Jan 8', balance: 11750 },
      { date: 'Jan 9', balance: 12000 },
      { date: 'Jan 10', balance: 11800 },
      { date: 'Jan 11', balance: 12150 },
      { date: 'Jan 12', balance: 11900 },
      { date: 'Jan 13', balance: 12200 },
      { date: 'Jan 14', balance: 12450 }
    ];

    const mockTradeAnalytics = {
      totalTrades: 47,
      winningTrades: 28,
      losingTrades: 19,
      winRate: 59.6,
      totalProfit: 1800.50,
      averageProfit: 64.30,
      averageLoss: -45.20,
      largestWin: 350.75,
      largestLoss: -120.50,
      profitFactor: 2.1,
      sharpeRatio: 1.8,
      maxDrawdown: -8.5,
      volatility: 12.3
    };

    const mockAssetAllocation = [
      { name: 'AAPL', value: 2950, color: '#0088FE' },
      { name: 'GOOGL', value: 2360, color: '#00C49F' },
      { name: 'MSFT', value: 2124, color: '#FFBB28' },
      { name: 'TSLA', value: 1770, color: '#FF8042' },
      { name: 'BTC/USD', value: 1416, color: '#8884D8' },
      { name: 'Cash', value: 1180, color: '#82CA9D' }
    ];

    const mockPerformanceData = [
      { month: 'Jan', profit: 1800, trades: 12 },
      { month: 'Feb', profit: 2200, trades: 15 },
      { month: 'Mar', profit: -500, trades: 8 },
      { month: 'Apr', profit: 3100, trades: 18 },
      { month: 'May', profit: 2800, trades: 16 },
      { month: 'Jun', profit: 1900, trades: 14 }
    ];

    setPortfolioData(mockPortfolioData);
    setTradeAnalytics(mockTradeAnalytics);
    setAssetAllocation(mockAssetAllocation);
    setPerformanceData(mockPerformanceData);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Date: ${label}`}</p>
          <p className="tooltip-value">
            {`Portfolio: $${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Detailed insights into your trading performance</p>
          </div>
          <div className="timeframe-selector">
            <label>Timeframe:</label>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="timeframe-select"
            >
              <option value="1w">1 Week</option>
              <option value="1m">1 Month</option>
              <option value="3m">3 Months</option>
              <option value="1y">1 Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics">
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-label">Total Return</div>
            <div className="metric-value positive">+18.0%</div>
            <div className="metric-subtext">+$1,800.50</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-label">Win Rate</div>
            <div className="metric-value">{tradeAnalytics.winRate}%</div>
            <div className="metric-subtext">28W / 19L</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-label">Profit Factor</div>
            <div className="metric-value">{tradeAnalytics.profitFactor}</div>
            <div className="metric-subtext">Risk/Reward Ratio</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-label">Sharpe Ratio</div>
            <div className="metric-value">{tradeAnalytics.sharpeRatio}</div>
            <div className="metric-subtext">Risk-Adjusted Return</div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Portfolio Performance */}
        <div className="analytics-card full-width">
          <div className="card-header">
            <h3>Portfolio Performance</h3>
            <div className="card-actions">
              <span className="performance-indicator positive">+18.0%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#1D4ED8' }}
                name="Portfolio Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Win Rate Visualization */}
        <div className="analytics-card">
          <h3>Win Rate Analysis</h3>
          <div className="win-rate-display">
            <div className="win-rate-circle">
              <div className="win-rate-progress">
                <span className="win-rate-value">{tradeAnalytics.winRate}%</span>
              </div>
            </div>
            <div className="win-rate-stats">
              <div className="win-stat">
                <span className="win-label">Winning Trades:</span>
                <span className="win-count positive">{tradeAnalytics.winningTrades}</span>
              </div>
              <div className="win-stat">
                <span className="win-label">Losing Trades:</span>
                <span className="win-count negative">{tradeAnalytics.losingTrades}</span>
              </div>
              <div className="win-stat">
                <span className="win-label">Total Trades:</span>
                <span className="win-count">{tradeAnalytics.totalTrades}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="analytics-card">
          <h3>Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={assetAllocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {assetAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trade Statistics */}
        <div className="analytics-card">
          <h3>Trade Statistics</h3>
          <div className="stats-list">
            <div className="stat-item">
              <span>Total Profit:</span>
              <span className="positive">${tradeAnalytics.totalProfit}</span>
            </div>
            <div className="stat-item">
              <span>Avg Win:</span>
              <span className="positive">${tradeAnalytics.averageProfit}</span>
            </div>
            <div className="stat-item">
              <span>Avg Loss:</span>
              <span className="negative">${tradeAnalytics.averageLoss}</span>
            </div>
            <div className="stat-item">
              <span>Largest Win:</span>
              <span className="positive">${tradeAnalytics.largestWin}</span>
            </div>
            <div className="stat-item">
              <span>Largest Loss:</span>
              <span className="negative">${tradeAnalytics.largestLoss}</span>
            </div>
            <div className="stat-item">
              <span>Max Drawdown:</span>
              <span className="negative">{tradeAnalytics.maxDrawdown}%</span>
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="analytics-card full-width">
          <h3>Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Profit']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="profit" 
                name="Profit/Loss" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="trades" 
                name="Number of Trades" 
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Metrics */}
        <div className="analytics-card">
          <h3>Risk Metrics</h3>
          <div className="risk-metrics">
            <div className="risk-metric">
              <div className="risk-label">Volatility</div>
              <div className="risk-value">{tradeAnalytics.volatility}%</div>
              <div className="risk-description">Portfolio volatility</div>
            </div>
            <div className="risk-metric">
              <div className="risk-label">Sharpe Ratio</div>
              <div className="risk-value positive">{tradeAnalytics.sharpeRatio}</div>
              <div className="risk-description">Risk-adjusted return</div>
            </div>
            <div className="risk-metric">
              <div className="risk-label">Max Drawdown</div>
              <div className="risk-value negative">{tradeAnalytics.maxDrawdown}%</div>
              <div className="risk-description">Largest peak-to-trough</div>
            </div>
            <div className="risk-metric">
              <div className="risk-label">Profit Factor</div>
              <div className="risk-value positive">{tradeAnalytics.profitFactor}</div>
              <div className="risk-description">Gross profit / gross loss</div>
            </div>
          </div>
        </div>

        {/* Trading Activity */}
        <div className="analytics-card">
          <h3>Trading Activity</h3>
          <div className="activity-stats">
            <div className="activity-metric">
              <div className="activity-label">Daily Average Trades</div>
              <div className="activity-value">3.2</div>
            </div>
            <div className="activity-metric">
              <div className="activity-label">Most Traded Asset</div>
              <div className="activity-value">AAPL</div>
            </div>
            <div className="activity-metric">
              <div className="activity-label">Best Performing</div>
              <div className="activity-value positive">BTC/USD</div>
            </div>
            <div className="activity-metric">
              <div className="activity-label">Active Trading Days</div>
              <div className="activity-value">24/30</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;