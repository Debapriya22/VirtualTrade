import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function TradingInterface() {
  const { user, updateBalance } = useAuth();
  const [marketData, setMarketData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState(1);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [limitPrice, setLimitPrice] = useState('');

  useEffect(() => {
    const initialData = {
      'AAPL': { price: 182.63, change: 1.25, changePercent: 0.69 },
      'GOOGL': { price: 138.21, change: -0.45, changePercent: -0.32 },
      'MSFT': { price: 337.79, change: 2.34, changePercent: 0.70 },
      'TSLA': { price: 248.50, change: -5.25, changePercent: -2.07 },
      'BTC/USD': { price: 43250, change: 1250, changePercent: 2.98 }
    };
    setMarketData(initialData);

    const interval = setInterval(() => {
      setMarketData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(symbol => {
          const randomChange = (Math.random() - 0.5);
          newData[symbol].price += randomChange;
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const executeTrade = (type) => {
    const price = marketData[selectedSymbol]?.price || 0;
    const totalCost = price * quantity;

    if (type === 'buy' && totalCost > user.balance) {
      alert('Insufficient balance!');
      return;
    }

    const newBalance = type === 'buy' 
      ? user.balance - totalCost 
      : user.balance + totalCost;

    updateBalance(newBalance);

    const tradeDetails = {
      symbol: selectedSymbol,
      type,
      orderType,
      quantity,
      price,
      stopLoss: stopLoss || 'Not set',
      takeProfit: takeProfit || 'Not set',
      limitPrice: limitPrice || 'Market',
      total: totalCost,
      newBalance
    };

    alert(`Trade Executed!\n\n` +
      `Symbol: ${tradeDetails.symbol}\n` +
      `Type: ${tradeDetails.type.toUpperCase()}\n` +
      `Order Type: ${tradeDetails.orderType}\n` +
      `Quantity: ${tradeDetails.quantity}\n` +
      `Price: $${tradeDetails.price.toFixed(2)}\n` +
      `Total: $${tradeDetails.total.toFixed(2)}\n` +
      `New Balance: $${tradeDetails.newBalance.toFixed(2)}`
    );

    // Reset form
    setQuantity(1);
    setStopLoss('');
    setTakeProfit('');
    setLimitPrice('');
  };

  return (
    <div className="trading-interface">
      <div className="trading-header">
        <h1>Trading Interface</h1>
        <div className="balance-display">
          Available Balance: <strong>${user?.balance.toLocaleString()}</strong>
        </div>
      </div>

      <div className="trading-layout">
        <div className="market-panel">
          <h3>Market Watch</h3>
          <div className="symbols-list">
            {Object.entries(marketData).map(([symbol, data]) => (
              <div 
                key={symbol} 
                className={`symbol-item ${selectedSymbol === symbol ? 'selected' : ''}`}
                onClick={() => setSelectedSymbol(symbol)}
              >
                <div className="symbol-name">{symbol}</div>
                <div className="symbol-price">${data.price.toFixed(2)}</div>
                <div className={`symbol-change ${data.change >= 0 ? 'positive' : 'negative'}`}>
                  {data.changePercent.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-panel">
          <h3>Place Order</h3>
          
          <div className="order-form">
            <div className="form-row">
              <div className="form-group">
                <label>Symbol</label>
                <select 
                  value={selectedSymbol} 
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                >
                  {Object.keys(marketData).map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Order Type</label>
                <select 
                  value={orderType} 
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop">Stop</option>
                  <option value="stop-limit">Stop-Limit</option>
                </select>
              </div>
            </div>

            <div className="current-price">
              Current Price: <strong>${marketData[selectedSymbol]?.price.toFixed(2)}</strong>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>

            {orderType === 'limit' || orderType === 'stop-limit' ? (
              <div className="form-group">
                <label>Limit Price</label>
                <input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder="Enter limit price"
                  step="0.01"
                />
              </div>
            ) : null}

            <div className="form-row">
              <div className="form-group">
                <label>Stop Loss</label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="Optional"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Take Profit</label>
                <input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="Optional"
                  step="0.01"
                />
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-item">
                <span>Estimated Cost:</span>
                <span>${((marketData[selectedSymbol]?.price || 0) * quantity).toFixed(2)}</span>
              </div>
            </div>

            <div className="trade-buttons">
              <button 
                className="buy-btn"
                onClick={() => executeTrade('buy')}
              >
                BUY
              </button>
              <button 
                className="sell-btn"
                onClick={() => executeTrade('sell')}
              >
                SELL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradingInterface;