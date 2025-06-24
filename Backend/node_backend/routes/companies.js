const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://localhost:27017'; // MongoDB connection string
const client = new MongoClient(uri);

router.get('/', async (req, res) => {
  try {
    await client.connect(); // Connect to MongoDB (can be refactored later to avoid connecting on every request)
    const db = client.db('testDb'); // Choose your database
    const companies = await db.collection('companies').find({}).toArray(); // Fetch all documents from 'companies'
    res.json(companies); // Return the documents as JSON
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Handle failure case
  }
});

module.exports = router;