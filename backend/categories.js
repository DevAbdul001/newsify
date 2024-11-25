const express = require('express')
const db = require('./db')

const router = express.Router()

router.get('/:category', (req, res) => {
    const category = req.params.category;
  
    const query = `
      SELECT * FROM news
      WHERE category = ?
      ORDER BY published_at DESC;
    `;
  
    db.query(query, [category], (err, results) => {
      if (err) {
        console.error('Error fetching news by category:', err);
        return res.status(500).json({ message: 'Error fetching news' });
      }
      res.status(200).json({ news: results });
    });
  });
module.exports = router;
