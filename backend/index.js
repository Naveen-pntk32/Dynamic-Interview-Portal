const dotenv = require('dotenv');
const connect = require('./config/db');
const express = require('express');
const app = express();

dotenv.config();
connect();

app.get('/', (req, res) => {
    res.send("Hello World!");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});