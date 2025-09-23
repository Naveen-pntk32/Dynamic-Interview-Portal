const mongoose = require('mongoose');

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://muthumanikandan11mk:Mk11%402004@mycluster.1gybapu.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster';
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB || 'mock_interview',
  });
  console.log('MongoDB connected');
}

module.exports = { connectToDatabase };


