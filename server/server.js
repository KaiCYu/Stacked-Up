const db = require('./db/index').connection;
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookie = require('cookie-parser');
const session = require('express-session');

const port = 8000;

const app = express();

app.use(express.static(`${__dirname}/../app/dist`));
app.use(cookie());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'there is no secret',
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('====>', user[0].id);
  done(null, user[0].id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser', id);
  const queryStr = `SELECT * FROM applicants WHERE id = "${id}";`;
  db.query(queryStr, (err, user) => {
    done(err, user[0]);
  });
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    const queryStr = `SELECT * FROM applicants WHERE username = "${username}";`;
    db.query(queryStr, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect user ID' });
      }
      if (user[0].password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user, { message: 'welcome!' });
    });
  }
));

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.get('/getJobPostings', (req, res) => {
  //find job postings from db and send it back
  //res.json(data);
});

app.post('/login', passport.authenticate('local'),
  (req, res) => {
    if (req.user) {
      console.log(">>>", req.session.passport.user, "<<<");
      console.log(req.user, 'yes!!');
    }
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
