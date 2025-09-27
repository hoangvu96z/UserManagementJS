const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const countriesFile = path.join(__dirname, '../../data/countries.json');
    const data = await fs.readFile(countriesFile, 'utf8');
    const countries = JSON.parse(data);
    res.json(countries);
  } catch (error) {
    console.error('Error loading countries:', error);
    res.status(500).json({ error: 'Failed to load countries' });
  }
});

module.exports = router;
