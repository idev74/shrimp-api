require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

require('./data/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require('./controllers/auth')(app);
require('./controllers/shrimps')(app);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
