const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock market data
const mockMarketData = {
  'AAPL': { price: 182.63, change: 1.25, changePercent: 0.69 },
  'GOOGL': { price: 138.21, change: -0.45, changePercent: -0.32 },
  'MSFT': { price: 337.79, change: 2.34, changePercent: 0.70 },
  'EUR/USD': { price: 1.0723, change: -0.0012, changePercent: -0.11 },
  'GBP/USD': { price: 1.2547, change: 0.0034, changePercent: 0.27 }
};

// Get all symbols
router.get('/symbols', (req, res) => {
  const symbols = Object.keys(mockMarketData).map(symbol => ({
    symbol,
    ...mockMarketData[symbol]
  }));
  res.json(symbols);
});

// Get specific symbol data
router.get('/:symbol', (req, res) => {
  const { symbol } = req.params;
  const data = mockMarketData[symbol];
  
  if (!data) {
    return res.status(404).json({ message: 'Symbol not found' });
  }
  
  res.json({
    symbol,
    ...data,
    timestamp: new Date()
  });
});

// Get historical data (mock)
router.get('/:symbol/history', (req, res) => {
  const { symbol } = req.params;
  const { period = '1d' } = req.query;
  
  // Generate mock historical data
  const basePrice = mockMarketData[symbol]?.price || 100;
  const historicalData = [];
  
  for (let i = 0; i < 50; i++) {
    const priceChange = (Math.random() - 0.5) * 10;
    historicalData.push({
      timestamp: new Date(Date.now() - (50 - i) * 3600000),
      open: basePrice + priceChange - 2,
      high: basePrice + priceChange + 3,
      low: basePrice + priceChange - 3,
      close: basePrice + priceChange,
      volume: Math.floor(Math.random() * 1000000)
    });
  }
  
  res.json(historicalData);
});

module.exports = router;