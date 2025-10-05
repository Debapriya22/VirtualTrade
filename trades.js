const express = require('express');
const router = express.Router();

// In-memory storage for trades
const trades = [];
let tradeId = 1;

// Get all trades for user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userTrades = trades.filter(trade => trade.userId === parseInt(userId));
  res.json(userTrades);
});

// Execute a trade
router.post('/execute', (req, res) => {
  const { 
    symbol, 
    type, 
    orderType = 'market', 
    quantity, 
    price,
    stopLoss,
    takeProfit,
    limitPrice 
  } = req.body;
  
  const userId = 1; // Mock user ID
  
  const trade = {
    id: tradeId++,
    userId,
    symbol,
    type,
    orderType,
    quantity: parseFloat(quantity),
    entryPrice: parseFloat(price),
    currentPrice: parseFloat(price),
    stopLoss: stopLoss ? parseFloat(stopLoss) : null,
    takeProfit: takeProfit ? parseFloat(takeProfit) : null,
    limitPrice: limitPrice ? parseFloat(limitPrice) : null,
    status: 'executed',
    pnl: null,
    pnlPercentage: null,
    created_at: new Date(),
    closed_at: null
  };
  
  trades.push(trade);
  
  res.json({
    message: 'Trade executed successfully',
    trade,
    orderId: `ORD${trade.id.toString().padStart(6, '0')}`
  });
});

// Close a trade
router.post('/close/:tradeId', (req, res) => {
  const { tradeId } = req.params;
  const { closePrice } = req.body;
  
  const trade = trades.find(t => t.id === parseInt(tradeId));
  if (!trade) {
    return res.status(404).json({ message: 'Trade not found' });
  }
  
  const pnl = trade.type === 'buy' 
    ? (closePrice - trade.entryPrice) * trade.quantity
    : (trade.entryPrice - closePrice) * trade.quantity;
  
  trade.status = 'closed';
  trade.closed_at = new Date();
  trade.closePrice = parseFloat(closePrice);
  trade.pnl = pnl;
  trade.pnlPercentage = (pnl / (trade.entryPrice * trade.quantity)) * 100;
  
  res.json({
    message: 'Trade closed successfully',
    trade,
    pnl: trade.pnl
  });
});

// Get trade by ID
router.get('/:id', (req, res) => {
  const trade = trades.find(t => t.id === parseInt(req.params.id));
  if (!trade) {
    return res.status(404).json({ message: 'Trade not found' });
  }
  res.json(trade);
});

module.exports = router;