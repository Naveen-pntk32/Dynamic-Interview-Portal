const mongoose = require('mongoose');

let status = 'disconnected';

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mock_interview';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: process.env.MONGO_DB || 'mock_interview' });
  status = 'connected';
  console.log('MongoDB connected');
}

function getConnectionStatus() {
  return status;
}

module.exports = { connectDB, getConnectionStatus };


