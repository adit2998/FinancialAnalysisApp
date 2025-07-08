const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

router.get('/:ticker/reports_list', async (req, res) => {
  const { ticker } = req.params;

  try {
    await client.connect();
    const db = client.db('testDb');
    const collection = db.collection('company_reports');

    // Find all documents with the matching ticker
    const cursor = collection.find({ ticker: ticker.toLowerCase() });

    const reports = await cursor.toArray();

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No reports found for this ticker' });
    }

    // Extract all filenames
    const filenames = reports.map(doc => doc.file_name);

    res.json({ ticker, reports: filenames });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

module.exports = router;