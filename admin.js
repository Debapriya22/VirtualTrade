const express = require('express');
const router = express.Router();

// Mock users data
let users = [
  {
    id: 1,
    email: 'admin@trading.com',
    fullName: 'Admin User',
    virtualBalance: 10000.00,
    isAdmin: true,
    createdAt: new Date()
  },
  {
    id: 2,
    email: 'user@trading.com',
    fullName: 'Demo User',
    virtualBalance: 10000.00,
    isAdmin: false,
    createdAt: new Date()
  }
];

// Get all users (admin only)
router.get('/users', (req, res) => {
  res.json(users.map(user => ({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    virtualBalance: user.virtualBalance,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt
  })));
});

// Reset user balance
router.post('/users/:id/reset-balance', (req, res) => {
  const userId = parseInt(req.params.id);
  const { newBalance = 10000 } = req.body;
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  user.virtualBalance = parseFloat(newBalance);
  
  res.json({
    message: 'Balance reset successfully',
    user: {
      id: user.id,
      email: user.email,
      virtualBalance: user.virtualBalance
    }
  });
});

// Delete user
router.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter(u => u.id !== userId);
  
  res.json({ message: 'User deleted successfully' });
});

module.exports = router;