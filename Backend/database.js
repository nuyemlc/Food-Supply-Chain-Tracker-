const mysql = require('mysql2/promise');  // Import MySQL library with Promise support

// Create a connection pool for efficient, reusable MySQL connections
const pool = mysql.createPool({
  host: 'localhost',             // Database host (local machine)
  user: 'root',                  // MySQL username
  password: '12345',             // MySQL password (keep in .env in production)
  database: 'food_supply_tracker', // Target database name
  waitForConnections: true,      // Queue requests if no available connection
  connectionLimit: 10,           // Maximum number of connections in the pool
  queueLimit: 0                  // No limit on queued connection requests
});

module.exports = pool;           // Export the pool to be used across the backend
