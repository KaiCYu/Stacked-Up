const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.static(__dirname + '/../dist'))

app.use(express.static(`${__dirname}/../app/dist`));

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

module.exports = app;
