const express = require('express');
const router = express.Router();

// Mock analytics data
const analyticsData = {
  portfolioHistory: [
    { date: '2024-01-01', balance: 10000 },
    { date: '2024-01-02', balance: 10250 },
    { date: '2024-01-03', balance: 10100 },
    { date: '2024-01-04', balance: 10500 },
    { date: '2024-01-05', balance: 11250 },
    { date: '2024-01-06', balance: 11000 },
    { date: '2024-01-07', balance: 11500 },
    { date: '2024-01-08', balance: 11750 },
    { date: '2024-01-09', balance: 12000 },
    { date: '2024-01-10', balance: 11800 }
  ],
  tradeAnalytics: {
    totalTrades: 47,
    winningTrades: 28,
    losingTrades: 19,
    winRate: 59.6,
    totalProfit: 1800.50,
    averageProfit: 64.30,
    averageLoss: -45.20,
    largestWin: 350.75,
    largestLoss: -120.50
  },
  assetAllocation: [
    { symbol: 'AAPL', allocation: 25, value: 2950 },
    { symbol: 'GOOGL', allocation: 20, value: 2360 },
    { symbol: 'MSFT', allocation: 18, value: 2124 },
    { symbol: 'TSLA', allocation: 15, value: 1770 },
    { symbol: 'BTC/USD', allocation: 12, value: 1416 },
    { symbol: 'Cash', allocation: 10, value: 1180 }
  ]
};

// Get portfolio history
router.get('/portfolio-history/:userId', (req, res) => {
  res.json(analyticsData.portfolioHistory);
});

// Get trade analytics
router.get('/trade-analytics/:userId', (req, res) => {
  res.json(analyticsData.tradeAnalytics);
});

// Get asset allocation
router.get('/asset-allocation/:userId', (req, res) => {
  res.json(analyticsData.assetAllocation);
});

// Get performance metrics
router.get('/performance/:userId', (req, res) => {
  res.json({
    ...analyticsData.tradeAnalytics,
    sharpeRatio: 1.8,
    maxDrawdown: -8.5,
    volatility: 12.3,
    monthlyReturn: 4.2
  });
});

module.exports = router;