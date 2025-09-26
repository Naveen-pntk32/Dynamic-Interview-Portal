require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

// Connect to MongoDB at startup
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


