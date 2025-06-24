// const express = require('express');
// const connectDB = require('./db');  // Import the DB connection
// const { getTickers } = require('./tickerInfo');  // Import the function to fetch tickers

// const app = express();
// const PORT = process.env.PORT || 5001;

// app.use(express.json());

// // Connect to the database
// connectDB();

// // Define a route to get tickers and their financials
// app.get('/api/tickers', async (req, res) => {
//   try {
//     const tickers = await getTickers();  // Fetch tickers with financials
//     res.json(tickers);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching tickers' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function getCompanies(req, res) {
  try {
    await client.connect();
    const db = client.db('testDb');
    const companies = await db.collection('companies').find({}).toArray();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

app.get('/api/companies', getCompanies);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));