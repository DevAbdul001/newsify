const express = require('express');
const crypto = require('crypto');
const db =require ('./db');

const router = express.Router();


// Signup Route
router.post('/', (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    function generateUserIds(input) {
      const timeStamp = Date.now().toString();
      const data = input + timeStamp;
      const hash = crypto.createHash('sha256').update(data).digest('hex');
      return hash.substring(0, 16);
    }
  
    const userId = generateUserIds(email);
    const hashedPwd = crypto.createHash('sha256').update(password).digest('hex');
  
    const query = 'INSERT INTO Users (user_id, username, email, password) VALUES (?, ?, ?, ?)';
  
    db.query(query, [userId, username, email, hashedPwd], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(201).json({ message: 'User Registered Successfully' });
    });
  });
  
  // Signin Route
  router.post('/signin', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    db.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const user = results[0];
      const hashedInputPassword = crypto.createHash('sha256').update(password).digest('hex');
  
      if (user.password !== hashedInputPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      res.status(200).json({ message: 'Login Successful' });
    });
  });
  
  module.exports = router;