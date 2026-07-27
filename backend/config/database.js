const mongoose = require('mongoose');

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://samiullahglotar420:malikecomerceappsami@ecommerce.jkzlt.mongodb.net/');
    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err);
    throw err;
  }
};

module.exports = connectDatabase;
