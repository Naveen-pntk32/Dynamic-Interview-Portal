const dotenv = require('dotenv');
const connect = require('./config/db');
const cors = require('cors');
const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes.js');

app.use(cors());
app.use(cors())

app.use(express.json());
dotenv.config();
connect();

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});