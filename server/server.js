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
const loggedInUsers = {};

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
    const temp = username.split('/');
    let queryStr;
    if (temp[1] === 'applicant') {
      queryStr = `SELECT * FROM applicants WHERE username = "${temp[0]}";`;
    } else if (temp[1] === 'company') {
      queryStr = `SELECT * FROM employer WHERE name = "${temp[0]}";`;
    }
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
  const queryStr = 'SELECT * FROM job_postings;';
  db.query(queryStr, (error, data) => {
    if (error) {
      console.log('failed to get job posting data', error);
    } else {
      res.send(data);
    }
  });
});

app.get('/login', (req, res) => {
  res.send('done!!');
});

app.post('/login', passport.authenticate('local'),
  (req, res) => {
    if (req.user) {
      res.send(req.user.username);
    } else {
      res.send('login fails!');
    }
  });

app.get('/profileinfo', passport.authenticate('local'),
  (req, res) => {
    if (req.user) {
      res.send(req.user.username);
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
 * :table represents the table name of our database being searched
 * :column represents the column name the chosen table
 * :query represents the value being searched
 * :fuzziness represents the number of possible misspelled characters
 * :size represents the amount of matched results to return
 */
app.get('/search/:table/:column/:query/:fuzziness/:size', (req, res) => {
  const column = req.params.column;
  const match = {};
  const query = req.params.query;
  const size = req.params.size;
  const table = req.params.table;
  match[column] = {
    query,
    fuzziness,
  };
  const body = {
    size,
    from: 0,
    query: {
      match,
    },
  };
  elasticsearch.search('stackedup', body)
  .then((results) => {
    results = results.hits.hits.map(function(hit) {
      var applicant = hit._source;
      (applicant.username in loggedInUsers)?applicant.online=true
      :applicant.online=false;
      return applicant;
    })
    res.status(200).json(results);
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
  var username = ws.upgradeReq.url.replace('/?username=', '')
  console.log('\n' + username + ' <---- connected');

  loggedInUsers[username] = ws;

  console.log('loggedInUsers = ', Object.keys(loggedInUsers));
  let loggedInUsersInfoUpdate = {};
  Object.keys(loggedInUsers).forEach(function(applicantName) {
    loggedInUsersInfoUpdate[applicantName] = true;
  })
  let data = {
    type: 'loggedInUsersUpdate',
    loggedInUsers: loggedInUsersInfoUpdate
  };
  Object.keys(loggedInUsers).forEach(function(key) { //update all users
    let wsClient = loggedInUsers[key];
    wsClient.send( JSON.stringify(data) );
  });

  ws.on('message', (recObj)=> {
    recObj = JSON.parse(recObj);
  });

  ws.on('close', ()=> {
    console.log('\n' + username + ' <------ disconnected');
    delete loggedInUsers[username];

    console.log('loggedInUsers = ', Object.keys(loggedInUsers));
    let loggedInUsersInfoUpdate = {};
    Object.keys(loggedInUsers).forEach(function(applicantName) {
      loggedInUsersInfoUpdate[applicantName] = true;
    })
    let data = {
      type: 'loggedInUsersUpdate',
      loggedInUsers: loggedInUsersInfoUpdate
    };
    Object.keys(loggedInUsers).forEach(function(key) { //update all users
      let wsClient = loggedInUsers[key];
      wsClient.send( JSON.stringify(data) );
    });

    // clearInterval(oneSetInterval);
  });

  // var oneSetInterval = setInterval( ()=> {
  //   ws.send( JSON.stringify(new Date().toTimeString()) );
  // }, 10000);
});


