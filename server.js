require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

require('./data/db')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require('./controllers/auth.js')(app);
require('./controllers/shrimps.js')(app);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
