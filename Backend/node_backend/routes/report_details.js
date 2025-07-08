const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

router.get('/:ticker/report/:filename', async (req, res) => {
  const { ticker, filename } = req.params;

  try {
    await client.connect();
    const db = client.db('testDb');
    const collection = db.collection('company_reports');

    const report = await collection.findOne({
      ticker: ticker.toLowerCase(),
      file_name: filename
    });

    if (!report || !report.sections) {
      return res.status(404).json({ error: 'Report or sections not found' });
    }

    res.json({
      ticker,
      file_name: filename,
      sections: report.sections
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

module.exports = router;