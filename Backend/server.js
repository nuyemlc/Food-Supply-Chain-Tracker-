// Import necessary modules
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Session setup for tracking user logins securely
app.use(session({
  secret: 'mysecretkey', // In production, store this securely in environment variables
  resave: false,
  saveUninitialized: false,
}));

// Route to fetch all foods
app.get('/foods', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM foods');
    res.json(rows);
  } catch (err) {
    console.error('SQL Query Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to fetch foods with map coordinates
app.get('/api/origins', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        name,
        origin_country,
        category,
        co2_emissions,
        organic,
        ethical,
        transport_method,
        latitude,
        longitude
      FROM foods
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching origins:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch product info for listings
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        name,
        origin_country,
        category,
        co2_emissions,
        organic,
        ethical,
        transport_method
      FROM foods
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching product list:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User registration route
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Email already exists or registration failed' });
  }
});

// User login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.user = { id: user.id, name: user.name };
    res.json({ message: 'Login successful', name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Route to check if user is logged in
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, name: req.session.user.name });
  } else {
    res.json({ loggedIn: false });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});