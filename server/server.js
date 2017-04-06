const db = require('./db/index').connection;
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const port = 8000;

const app = express();

app.use(express.static(`${__dirname}/../app/dist`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.post('/login', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

app.listen(process.env.PORT || port, () => {
  /* eslint-disable no-console */
  console.log(`Server now listening on port ${port}`);
  /* eslint-enable no-console */
});
