const express = require('express');
const connectDB = require('./db');  // Import the DB connection
const { getTickers } = require('./tickerInfo');  // Import the function to fetch tickers

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Connect to the database
connectDB();

// Define a route to get tickers and their financials
app.get('/api/tickers', async (req, res) => {
  try {
    const tickers = await getTickers();  // Fetch tickers with financials
    res.json(tickers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickers' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});