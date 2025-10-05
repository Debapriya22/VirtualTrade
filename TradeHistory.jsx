import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function TradeHistory() {
  const [trades, setTrades] = useState([
    {
      id: 1,
      symbol: 'AAPL',
      type: 'buy',
      orderType: 'market',
      quantity: 10,
      entryPrice: 180.50,
      currentPrice: 182.63,
      stopLoss: 175.00,
      takeProfit: 190.00,
      pnl: 21.30,
      pnlPercentage: 1.18,
      status: 'open',
      createdAt: '2024-01-10 14:30:25'
    },
    {
      id: 2,
      symbol: 'GOOGL',
      type: 'sell',
      orderType: 'limit',
      quantity: 5,
      entryPrice: 140.00,
      currentPrice: 138.21,
      stopLoss: 145.00,
      takeProfit: 135.00,
      pnl: 8.95,
      pnlPercentage: 1.28,
      status: 'closed',
      createdAt: '2024-01-09 11:15:42',
      closedAt: '2024-01-10 09:20:15'
    },
    {
      id: 3,
      symbol: 'MSFT',
      type: 'buy',
      orderType: 'stop',
      quantity: 8,
      entryPrice: 335.00,
      currentPrice: 337.79,
      stopLoss: 330.00,
      takeProfit: 350.00,
      pnl: 22.32,
      pnlPercentage: 0.83,
      status: 'open',
      createdAt: '2024-01-08 16:45:12'
    },
    {
      id: 4,
      symbol: 'TSLA',
      type: 'sell',
      orderType: 'market',
      quantity: 15,
      entryPrice: 255.00,
      currentPrice: 248.50,
      stopLoss: 260.00,
      takeProfit: 240.00,
      pnl: 97.50,
      pnlPercentage: 2.55,
      status: 'closed',
      createdAt: '2024-01-07 10:20:33',
      closedAt: '2024-01-10 13:15:22'
    },
    {
      id: 5,
      symbol: 'BTC/USD',
      type: 'buy',
      orderType: 'limit',
      quantity: 0.1,
      entryPrice: 42000.00,
      currentPrice: 43250.00,
      stopLoss: 41000.00,
      takeProfit: 45000.00,
      pnl: 125.00,
      pnlPercentage: 2.98,
      status: 'open',
      createdAt: '2024-01-06 08:15:47'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true;
    return trade.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { class: 'status-open', label: 'Open' },
      closed: { class: 'status-closed', label: 'Closed' },
      executed: { class: 'status-executed', label: 'Executed' }
    };
    const config = statusConfig[status] || { class: 'status-default', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Symbol', 'Type', 'Order Type', 'Quantity', 'Entry Price', 'Current Price', 'Stop Loss', 'Take Profit', 'P&L', 'P&L %', 'Status', 'Date'];
    const csvData = filteredTrades.map(trade => [
      trade.id,
      trade.symbol,
      trade.type.toUpperCase(),
      trade.orderType,
      trade.quantity,
      `$${trade.entryPrice.toFixed(2)}`,
      `$${trade.currentPrice.toFixed(2)}`,
      trade.stopLoss ? `$${trade.stopLoss}` : '-',
      trade.takeProfit ? `$${trade.takeProfit}` : '-',
      `$${trade.pnl.toFixed(2)}`,
      `${trade.pnlPercentage.toFixed(2)}%`,
      trade.status,
      new Date(trade.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trading-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winRate = filteredTrades.length > 0 
    ? (filteredTrades.filter(trade => trade.pnl > 0).length / filteredTrades.length * 100).toFixed(1)
    : 0;

  return (
    <div className="trade-history">
      <div className="page-header">
        <h1>Trade History</h1>
        <p>View your trading activity and performance</p>
      </div>

      {/* Summary Stats */}
      <div className="history-stats">
        <div className="history-stat-card">
          <div className="stat-label">Total Trades</div>
          <div className="stat-value">{filteredTrades.length}</div>
        </div>
        <div className="history-stat-card">
          <div className="stat-label">Total P&L</div>
          <div className={`stat-value ${totalPnL >= 0 ? 'positive' : 'negative'}`}>
            ${totalPnL.toFixed(2)}
          </div>
        </div>
        <div className="history-stat-card">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value">{winRate}%</div>
        </div>
        <div className="history-stat-card">
          <div className="stat-label">Open Positions</div>
          <div className="stat-value">
            {filteredTrades.filter(trade => trade.status === 'open').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Trades</option>
            <option value="open">Open Trades</option>
            <option value="closed">Closed Trades</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From:</label>
          <input 
            type="date" 
            value={dateRange.from}
            onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
            className="filter-date"
          />
        </div>

        <div className="filter-group">
          <label>To:</label>
          <input 
            type="date" 
            value={dateRange.to}
            onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
            className="filter-date"
          />
        </div>

        <button onClick={exportToCSV} className="export-btn">
          Export CSV
        </button>
      </div>

      {/* Trades Table */}
      <div className="trades-table-container">
        <table className="trades-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Order Type</th>
              <th>Quantity</th>
              <th>Entry Price</th>
              <th>Current Price</th>
              <th>Stop Loss</th>
              <th>Take Profit</th>
              <th>P&L</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map(trade => (
              <tr key={trade.id}>
                <td>#{trade.id}</td>
                <td className="symbol-cell">{trade.symbol}</td>
                <td>
                  <span className={`trade-type ${trade.type}`}>
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td>{trade.orderType}</td>
                <td>{trade.quantity}</td>
                <td>${trade.entryPrice.toFixed(2)}</td>
                <td>${trade.currentPrice.toFixed(2)}</td>
                <td>{trade.stopLoss ? `$${trade.stopLoss}` : '-'}</td>
                <td>{trade.takeProfit ? `$${trade.takeProfit}` : '-'}</td>
                <td className={`pnl-cell ${trade.pnl >= 0 ? 'positive' : 'negative'}`}>
                  ${trade.pnl.toFixed(2)} ({trade.pnlPercentage.toFixed(2)}%)
                </td>
                <td>{getStatusBadge(trade.status)}</td>
                <td>{new Date(trade.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTrades.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No trades found</h3>
          <p>No trades match your current filters</p>
          <button 
            onClick={() => setFilter('all')}
            className="action-btn primary"
          >
            Show All Trades
          </button>
        </div>
      )}

      {trades.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No trades yet</h3>
          <p>Start trading to see your history here</p>
          <Link to="/trade" className="action-btn primary">
            Place First Trade
          </Link>
        </div>
      )}
    </div>
  );
}

export default TradeHistory;