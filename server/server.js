const db = require('./db/index').connection;
const express = require('express');
const SocketServer = require('ws').Server;
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const cookie = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const elasticsearch = require('./elasticsearch/index.js');

const port = 8000;

const app = express();

app.use(express.static(`${__dirname}/../app/dist`));
// app.use(cookie());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'there is no secret',
  resave: false,
  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('====>', user.id);
  done(null, user.id);
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
      if (!user.length) {
        return done(null, false);
      }
      return bcrypt.compare(password, user[0].password, (err, res) => {
        if (res) {
          done(null, user[0]);
        }
        done(null, false);
      });
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

app.get('/login', (req, res) => {
  res.send('done!!');
});

app.post('/login', passport.authenticate('local'),
  (req, res) => {
    if (req.user) {
      res.redirect('/login');
    } else {
      res.redirect('/');
    }
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

app.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    }
    console.log('request username and fullname = ' + req.body.username + req.body.fullname)
    const queryStr = `INSERT INTO applicants (username, password, fullname) values ("${req.body.username}", "${hash}", "${req.body.fullname}");`
    db.query(queryStr, (error, data) => {
      if (error) {
        console.log('err', error);
      } else {
        console.log('applicant has signed up!', data);
        res.redirect('/');
      }
    });
  });
});

/*
 * :username represents the username being searched
 * :size represents the amount of matched results to return
 */
app.get('/search/:username/:size', (req, res) => {
  const username = req.params.username;
  const size = req.params.size;
  const body = {
    size,
    from: 0,
    query: {
      match: {
        username: {
          query: username,
        },
      },
    },
  };
  elasticsearch.search('stackedup', body)
  .then((results) => {
    res.status(200).send(results);
  });
});

app.listen(process.env.PORT || port, () => {
  /* eslint-disable no-console */
  console.log(`Server now listening on port ${port}`);
  /* eslint-enable no-console */
});

const wss = new SocketServer({
  server: app,
  port: 3000 });
wss.on('connection', (ws) => {
  var clientID = ws.upgradeReq.rawHeaders[21].slice(0,5);
  console.log('\n' + clientID + ' <---- connected');

  ws.on('message', (recObj)=> {
    recObj = JSON.parse(recObj);
  });

  ws.on('close', ()=> {
    console.log('\n' + clientID, ' <------ disconnected');
    clearInterval(oneSetInterval);
  });

  var oneSetInterval = setInterval( ()=> {
    ws.send( JSON.stringify(new Date().toTimeString()) );
  }, 10000);
});


