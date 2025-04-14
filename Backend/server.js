require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'food_supply_tracker'
  });
  

db.connect(err => {
    if (err) {
        console.error('❌ Database connection error:', err);
    } else {
        console.log('✅ Connected to MySQL Database');
    }
});

// API Route to Fetch Food Data
app.get('/foods', (req, res) => {
    db.query('SELECT * FROM foods', (err, results) => {
        if (err) {
            console.error('❌ SQL Query Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
