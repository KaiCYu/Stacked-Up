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
    const list = Array.from(Object.keys(loggedInUsers));
    let userLoggedIn = false;
    for (let i = 0; i < list.length; i += 1) {
      if (list[i] === temp[0]) {
        userLoggedIn = true;
        break;
      }
    }
    if (!userLoggedIn) {
      if (temp[1] === 'applicant') {
        queryStr = `SELECT * FROM applicants WHERE username = "${temp[0]}";`;
      } else if (temp[1] === 'company') {
        queryStr = `SELECT * FROM employer WHERE name = "${temp[0]}";`;
      }
      db.query(queryStr, (err1, user) => {
        if (err1) {
          return done(err1);
        }
        if (!user.length) {
          return done(null, false);
        }
        return bcrypt.compare(password, user[0].password, (err2, res) => {
          if (res) {
            done(null, user[0]);
          }
          done(null, false);
        });
      });
    } else {
      done(null, false);
    }
  }));

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

// app.get('/login', (req, res) => {
//   res.send('done!!');
// });

app.post('/login', passport.authenticate('local'),
  (req, res) => {
    if (req.user) {
      res.send(req.user.username);
    } else {
      res.send('login fails!');
    }
  });

app.get('/logout', (req, res) => {
  req.logout();
  console.log("I'm here");
  res.redirect('/');
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
  // console.log(typeof req.body.position);
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

app.post('/signupApplicant', (req, res) => {
  console.log(" ========================= ", req._parsedOriginalUrl.path);
  let queryStr = 'SELECT * FROM applicants WHERE username=?;';
  db.query(queryStr, req.body.username, (err1, data, fields) => {
    if (err1) {
      console.log(err1);
      res.status(500).send('Internal Server Error');
    } else if (data.length !== 0) {
      // case when no such your exists
      const redirectUrl = `import React from 'react';
        const redirect = () => (
        <Redirect to="${req._parsedOriginalUrl.path}">);`;
      res.send(redirectUrl);
    } else {
      bcrypt.hash(req.body.password, 10, (err2, hash) => {
        if (err2) {
          console.log(err2);
          res.status(500).send('Internal Server Error');
        }
        console.log('request username and fullname = ' + req.body.username + req.body.fullname)
        queryStr = `INSERT INTO applicants (username, password, fullname) values ("${req.body.username}", "${hash}", "${req.body.fullname}");`
        db.query(queryStr, (err3, data) => {
          if (err3) {
            console.log('err', err3);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('applicant has signed up!', data);
            res.redirect('/');
          }
        });
      });
    }
  });
});

app.post('/signupEmployer', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      console.log('ERROR signup in server: ', err);
      res.sendStatus(500);
    }
    console.log('request body ', req.body);
    const queryStr = `INSERT INTO employer (username, password, company_name, email, phone_number, city, state, country) values ("${req.body.username}", "${hash}", "${req.body.info.companyName}", "${req.body.info.email}", "${req.body.info.phoneNumber}", "${req.body.info.city}", "${req.body.info.state}", "${req.body.info.country}");`

    db.query(queryStr, (error, data) => {
      if (error) {
        console.log('err', error);
      } else {
        console.log('employer has signed up!', data);
        res.redirect('/');
      }
    });
  });
});

/*
 * route for searching
 * :table represents the table name of our database being searched
 * :column represents the column name the chosen table
 * :query represents the value being searched
 * :fuzziness represents the number of possible misspelled characters
 * :size represents the amount of matched results to return
 */


// new search

// app.get('/search/:table/:column/:query/:fuzziness/:size', (req, res) => {
//   const column = req.params.column;
//   const fuzziness = req.params.fuzziness;
//   const match = {};
//   const query = req.params.query;
//   const size = req.params.size;
//   const table = req.params.table;
//   match[column] = {
//     query,
//     fuzziness,
//   };
//   const body = {
//     size,
//     from: 0,
//     query: {
//       match,
//     },
//   };
//   elasticsearch.search('stackedup', body)
//   .then((results) => {
//     results = results.hits.hits.map(function(hit) {
//       var applicant = hit._source;
//       (applicant.username in loggedInUsers)?applicant.online=true
//       :applicant.online=false;
//       return applicant;
//     });
//     res.status(200).json(results);
//   });
// });

// old search

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
          fuzziness: 15
        },
      },
    },
  };
  elasticsearch.search('stackedup', body)
  .then((results) => {
    results = results.hits.hits.map(function(hit) {
      var applicant = hit._source;
      (applicant.username in loggedInUsers)?applicant.online=true
      :applicant.online=false;
      return applicant;
    });
    res.status(200).json(results);
  })
  .catch(() => {
    res.sendStatus(404);
  });
});

app.post('/requestCall', (req, res) => {
  if (req.body.called && req.body.called in loggedInUsers) {
    let wsClient = loggedInUsers[req.body.called][1];
    let requestorID = loggedInUsers[req.body.requestor][0];
    let calledID = loggedInUsers[req.body.called][0];
    var room = requestorID+calledID;
    wsClient.send(JSON.stringify({
      type: 'videoCallRequest',
      requestor: req.body.requestor,
      room: room,
    }));
  }
  res.status(200).send(room);
})

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

  loggedInUsers[username] = [clientID, ws];

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
    let wsClient = loggedInUsers[key][1];
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
      let wsClient = loggedInUsers[key][1];
      wsClient.send( JSON.stringify(data) );
    });

    // clearInterval(oneSetInterval);
  });

  // var oneSetInterval = setInterval( ()=> {
  //   ws.send( JSON.stringify(new Date().toTimeString()) );
  // }, 10000);
});

// index database for elasticsearch every minute
setInterval(elasticsearch.indexDatabase, 60000);
