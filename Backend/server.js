const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/foods', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM foods');
    res.json(rows);
  } catch (err) {
    console.error('SQL Query Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/origins', async (req, res) => {
    try {
      const [rows] = await db.query(
        "SELECT name, origin_country FROM foods WHERE origin_country IS NOT NULL"
      );
      res.json(rows);
    } catch (err) {
      console.error('Error fetching origins:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
