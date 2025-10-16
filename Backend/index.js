require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const OrderRouter = require('./Routes/OrderRouter');
require('./Model/db');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;

// Debug env variables
console.log('Environment variables loaded:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');

app.get('/ping',(req, res) => {
    res.send("PONG");
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter);
app.use('/orders',OrderRouter);

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`)
})