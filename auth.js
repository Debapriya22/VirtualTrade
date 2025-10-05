const express = require('express');
const router = express.Router();

// In-memory storage for users (replace with database later)
let users = [
  {
    id: 1,
    email: 'admin@trading.com',
    password: 'password123', // In real app, hash this
    fullName: 'Admin User',
    virtualBalance: 10000.00,
    isAdmin: true,
    createdAt: new Date()
  }
];
let userId = 2;

// Register
router.post('/register', (req, res) => {
  const { email, password, fullName } = req.body;
  
  // Check if user exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: userId++,
    email,
    password, // In real app, hash this password
    fullName,
    virtualBalance: 10000.00,
    isAdmin: false,
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      virtualBalance: newUser.virtualBalance,
      isAdmin: newUser.isAdmin
    }
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      virtualBalance: user.virtualBalance,
      isAdmin: user.isAdmin
    }
  });
});

// Get user balance
router.get('/balance', (req, res) => {
  // Mock user ID (in real app, get from auth token)
  const userId = 1;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({ balance: user.virtualBalance });
});

// Verify token endpoint (for frontend)
router.get('/verify', (req, res) => {
  // Mock verification - in real app, verify JWT token
  const user = users[0]; // Return first user for demo
  res.json({ 
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      virtualBalance: user.virtualBalance,
      isAdmin: user.isAdmin
    }
  });
});

module.exports = router;