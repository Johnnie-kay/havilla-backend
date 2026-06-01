const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully: Havilla database is live!');
  } catch (error) {
    console.error('Failed to Connect to Database:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;