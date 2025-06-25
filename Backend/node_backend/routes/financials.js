// routes/financials.js
const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

router.get('/:ticker/trends', async (req, res) => {
  const { ticker } = req.params;

  try {
    await client.connect();
    const db = client.db('testDb');
    const company = await db.collection('financial_trends').findOne({ ticker: ticker.toLowerCase() });

    if (!company || !company.financials) {
      return res.status(404).json({ error: 'Company or financials not found' });
    }

    res.json(company.financials);
  } catch (error) {
    console.error('Error fetching financial trends:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
