const mongoose = require('mongoose');

// Define the schema for the tickers with financials
const tickerSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    unique: true,
  }
});

// Create the model
const Ticker = mongoose.model('historical_financials', tickerSchema);

// Function to get all tickers along with financials
const getTickers = async () => {
  try {
    const tickers = await Ticker.find().select('ticker');; // Fetch all documents in the 'Tickers' collection
    return tickers.map(ticker => ticker.ticker);    
  } catch (error) {
    console.error('Error fetching tickers:', error);
    throw error;
  }
};

module.exports = { getTickers };