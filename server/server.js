const db = require('./db/index').connection;
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer');
const upload = multer({ dest: 'upload/' });
const port = 8000;

const app = express();

app.use(express.static(`${__dirname}/../app/dist`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.get('/getJobPostings', (req, res) => {
  //find job postings from db and send it back
  //res.json(data);
});

app.post('/login', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

app.post('/postingJob', (req, res) => {
  console.log(req.body);
  console.log(typeof req.body.position);
  const queryStr = `INSERT INTO job_postings \
    (position, description, location, salary) VALUES \
    ("${req.body.position}", "${req.body.description}", "${req.body.location}", "${req.body.salary}")`;
  db.query(queryStr, (err, data) => {
    if (err) {
      console.log('err', err);
    } else {
      console.log(data);
      res.redirect('/');
    }
  });
});

app.listen(process.env.PORT || port, () => {
  /* eslint-disable no-console */
  console.log(`Server now listening on port ${port}`);
  /* eslint-enable no-console */
});
