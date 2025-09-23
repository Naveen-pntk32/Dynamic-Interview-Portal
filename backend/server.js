const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./config/database');

// Load env
dotenv.config();

console.log(process.env.MONGO_DB);
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const submitRoutes = require('./routes/submitRoutes');
const resultRoutes = require('./routes/resultRoutes');

app.use('/auth', authRoutes);
app.use('/questions', questionRoutes);
app.use('/submit', submitRoutes);
app.use('/results', resultRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

// Start server after DB connection
// const PORT = process.env.PORT || 5000;
// connectToDatabase()
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error('Failed to connect to DB', error);
//     process.exit(1);
//   });


