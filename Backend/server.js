// Import required modules
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./database'); // MySQL connection pool

const app = express();
const PORT = 3000;

// Apply middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for frontend-backend communication
app.use(express.json()); // Parse incoming JSON requests

// Configure user session management
app.use(session({
  secret: 'mysecretkey', // In a production environment, store secrets securely in environment variables
  resave: false,         // Avoid resaving session if nothing has changed
  saveUninitialized: false // Don’t create empty sessions
}));

// Endpoint: Retrieve all food records
app.get('/foods', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM foods');
    res.json(rows); // Send all foods as JSON
  } catch (err) {
    console.error('SQL Query Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: Get foods with map coordinates (used for Leaflet map display)
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

// Endpoint: Retrieve product data for listings (used in category browsing)
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

// Endpoint: Handle user registration securely
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Securely hash the password
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Email already exists or registration failed' });
  }
});

// Endpoint: Handle user login and session creation
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Save user session on successful login
    req.session.user = { id: user.id, name: user.name };
    res.json({ message: 'Login successful', name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Endpoint: Check if the current user is logged in (used by frontend)
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, name: req.session.user.name });
  } else {
    res.json({ loggedIn: false });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
