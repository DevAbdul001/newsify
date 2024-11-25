const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const db = require('./db');
require('dotenv').config({ path: 'app.env' });

const router = express.Router();

const apiKey = process.env.API_KEY;
const apiUrl = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`

// Fetch and Save News Functionality
async function fetchNews() {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        country: '', 
        category: 'entertainment',
      },
    });
    
    const articles = response.data.news;

    if (!articles || articles.length === 0) {
      console.log('No news articles found');
      return;
    }

    await saveNewsToDatabase(articles);
    console.log('News fetched and saved to database');
  } catch (error) {
    console.error('Error fetching news:', error.message);
  }
}
fetchNews();

async function saveNewsToDatabase(articles) {
  const query = `
    INSERT INTO news (news_id, title, description, image_url, published_at, source_name, category, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      title = VALUES(title),
      description = VALUES(description),
      source_name = VALUES(source_name),
      published_at = VALUES(published_at),
      category = VALUES(category)
  `;

  const promises = articles.map((article) => {
    const newsId = generateNewsId(article.url);
    const { title, description, image, source, published_at, category } = article;

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [
          newsId,
          title,
          description,
          image || '', // Default to empty string if no image
          new Date(published_at),
          source?.name || 'Unknown', // Handle missing source name
          category || 'General', // Default to 'General' if no category
          new Date(),
        ],
        (err, result) => {
          if (err) {
            console.error('Error inserting news:', err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });

  await Promise.all(promises);
}

function generateNewsId(input) {
  const timeStamp = Date.now().toString();
  const data = input + timeStamp;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return hash.substring(0, 16); // Return first 16 chars as the unique news ID
}

// POST route to insert news manually
router.post('/news', (req, res) => {
  const newsArticles = req.body;

  if (!Array.isArray(newsArticles) || newsArticles.length === 0) {
    return res.status(400).json({ message: 'Invalid Data Format or Empty Data' });
  }

  const query = `
    INSERT INTO news (news_id, title, description, image_url, published_at, source_name, category, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      title = VALUES(title),
      description = VALUES(description),
      source_name = VALUES(source_name),
      published_at = VALUES(published_at),
      category = VALUES(category)
  `;

  const promises = newsArticles.map((article) => {
    const newsId = generateNewsId(article.url);
    const { title, description, url, image_url, source, publishedAt, category } = article;

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [
          newsId,
          title,
          description,
          image_url,
          new Date(publishedAt),
          source,
          category || 'General',
          new Date(),
        ],
        (err, result) => {
          if (err) {
            console.error('Error inserting news:', err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });

  Promise.all(promises)
    .then(() => {
      res.status(201).json({ message: 'News stored successfully' });
    })
    .catch((error) => {
      console.error('Error storing news:', error);
      res.status(500).json({ message: 'Error storing news' });
    });
});


module.exports = router;