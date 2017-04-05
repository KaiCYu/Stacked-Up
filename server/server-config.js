const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/../app/dist`));

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

module.exports = app;
