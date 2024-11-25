
// Global error handler
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Something went wrong on the server' });
  };
  
 module.exports = errorHandler