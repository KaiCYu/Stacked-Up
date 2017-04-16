const db = require('./db/index').connection;
const express = require('express');
const SocketServer = require('ws').Server;
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const cookie = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const Promise = require('bluebird');
const fs = require('fs');
const elasticsearch = require('./elasticsearch/index.js');
const cloudinary = require('cloudinary');
const cloudinaryAPI = require('./../config/cloudinaryconfig.js');

const port = 8000;

const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.username;
    const path = `upload/${type}/`;
    if (!fs.existsSync('upload/')) {
      fs.mkdirSync('upload/');
    }
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    console.log('temp storage file upload, should not be used', file);
    cb(null, `${file.fieldname  }_${req.body.username}`);
  },
});

const upload = multer({ storage: tempStorage });

const app = express();
const loggedInUsers = {};

app.use(express.static(`${__dirname}/../app/dist`));
// app.use(cookie());
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'there is no secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000,
    name: 'StackedUp' } }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('serialize User in passport ====>', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('deserializeUser in passport', user);
  let queryStr;
  if (user.type === 'applicant') {
    queryStr = `SELECT * FROM applicants WHERE id = "${user.id}";`;
  } else {
    queryStr = `SELECT * FROM employer WHERE id = "${user.id}";`;
  }
  db.query(queryStr, (err, user) => {
    done(err, user[0]);
  });
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    const temp = username.split('/');
    console.log('passport authentication checking username and type : ', temp);
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
        queryStr = `SELECT * FROM employer WHERE username = "${temp[0]}";`;
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
            user[0].type = temp[1];
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

app.get('/verifyLogin', (req, res) => {
  if (req.user) {
    res.json(true);
  } else {
    res.json(false);
  }
});

app.get('/getCurrentUser', (req, res) => {
  if (req.user) {
    const currentUser = req.user;
    delete currentUser.password;
    res.json(currentUser);
  } else {
    res.sendStatus(500);
  }
});

app.get('/getJobPostings', (req, res) => {
  const queryStr = 'select job_postings.*, employer.company_name from job_postings inner join employer on job_postings.employer_id = employer.id;';
  db.query(queryStr, (error, data) => {
    if (error) {
      console.log('failed to get job posting data', error);
    } else {
      res.send(data);
    }
  });
});

app.post('/login', passport.authenticate('local'),
  (req, res) => {
    if (req.user) {
      res.send(req.user.username);
    } else {
      res.send('login fails!');
    }
  });

app.get('/logout', (req, res) => {
  const username = req.user.username;
  delete loggedInUsers[username];
  req.logout();
  console.log('user log out');
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
  const queryStr = `INSERT INTO job_postings \
    (position, description, location, salary, employer_id) VALUES \
    ("${req.body.position}", "${req.body.description}", "${req.body.location}", "${req.body.salary}", "${req.user.id}")`;
  db.query(queryStr, (err, data) => {
    if (err) {
      console.log('err', err);
      res.json(err);
    } else {
      console.log('job posting successful!: ', data);
      res.json(data);
    }
  });
});

//break down all async fnc
//create new promise using bluebird
//chaining promises

  // ATTEMPT TO PROMISIFY
// app.post('/signupApplicant', upload.any(), (req, res) => {
//   let queryStr = 'SELECT * FROM applicants WHERE username=?;';

//   return db.query(queryStr, req.body.username)
// }

// app.post('signupApplicant', (req, res) => {
//   const name;
//   db.queryAsync('select * from applicants;')
//   .then( (data) => {
//     console.log('REQUESTING: ', req);
//     console.log('DATA: ', data);
//     name = data;
//     db.queryAsync('select * from employer;')
//   })
//   .then()
// })

app.post('/signupApplicant', upload.any(), (req, res) => {
  // console.log(" ========================= ", req._parsedOriginalUrl.path);
  // console.log('REQ.URL: ', req.url);
  console.log("'REQ.BODY.RESUME: ", req.body.resume);
  let queryStr = 'SELECT * FROM applicants WHERE username=?;';
  db.query(queryStr, req.body.username, (err1, data, fields) => {
    if (err1) {
      console.log('signup applicant query error', err1);
      res.status(500).send('Internal Server Error');
    } else if (data.length !== 0) {
      // case when no such your exists
      const redirectUrl = `import React from 'react';
        const redirect = () => (
        <Redirect to="${req._parsedOriginalUrl.path}">);`;
      res.send(redirectUrl);
    } else {
      // upload the picture
      cloudinary.v2.uploader.upload(`${req.body.profilePhoto}`, { resource_type: 'auto'}, (err2, image) => {
        if ('ERROR 2 ', err2) {
          console.log('error sending profile picture to cloud ', err2);
        } else {
          console.log('IMAGE URL: ', image);
          // upload resume
          cloudinary.v2.uploader.upload(`${req.body.resume}`, { resource_type: 'auto' }, (err3, resume) => {
            if ('ERROR 3', err3) {
              console.log('error sending resume to cloud ', err3);
            } else {
              console.log('RESUME URL: ', resume);
              // upload cover letter
              cloudinary.v2.uploader.upload(`${req.body.coverLetter}`, { resource_type: 'auto' }, (err4, coverLetter) => {
                if ('ERROR 4: ', err4) {
                  console.log('error sending cover letter to cloud ', err4);
                } else {
                  console.log('COVER LETTER URL: '.coverLetter);
                // console.log('SECURE IMAGE URL:', image.secure_url);
                  bcrypt.hash(req.body.password, 10, (err5, hash) => {
                    if (err5) {
                      res.status(500).send('Internal Server Error');
                    }
                      // insert into DB
                      // console.log('request username and fullname = ' + req.body.username);
                    queryStr = `INSERT INTO applicants (username, password, firstname, lastname, email, phone_number, city, state, country, profile_pic_url, resume_url, coverletter_url) values
                      ("${req.body.username}", "${hash}", "${req.body.firstName}", "${req.body.lastName}",
                      "${req.body.email}", "${req.body.phoneNumber}", "${req.body.city}", "${req.body.state}", "${req.body.country}", "${image.secure_url}", "${resume.secure_url}", "${coverLetter.secure_url}"
                      );`;
                    db.query(queryStr, (err6, data) => {
                      if (err6) {
                        console.log('err', err6);
                        res.status(500).send('Internal Server Error');
                      } else {
                        console.log('applicant has signed up!', data);
                        res.json(data);
                      }
                    });
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

app.post('/signupEmployer', upload.any(), (req, res) => {
  // console.log(" ========================= ", req._parsedOriginalUrl.path);
  // console.log('REQ.URL: ', req.url);
  console.log('REQ.BODY: ', req.body);
  let queryStr = 'SELECT * FROM employer WHERE username=?;';
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
      // upload the logo
      cloudinary.v2.uploader.upload(`${req.body.logo}`, { resource_type: 'auto'}, (err2, image) => {
        if ('ERROR 2 ', err2) {
          console.log('error sending logo to cloud ', err2);
        } else {
          console.log('IMAGE URL: ', image);
          bcrypt.hash(req.body.password, 10, (err5, hash) => {
            if (err5) {
              res.status(500).send('Internal Server Error');
            }
              // insert into DB
              // console.log('request username and fullname = ' + req.body.username);
            queryStr = `INSERT INTO employer (username, password, company_name, email, phone_number, city, state, country, logo_url) values
              ("${req.body.username}", "${hash}", "${req.body.companyName}",
              "${req.body.email}", "${req.body.phoneNumber}", "${req.body.city}", "${req.body.state}", "${req.body.country}", "${image.secure_url}"
              );`;
            db.query(queryStr, (err6, data) => {
              if (err6) {
                console.log('ERROR 6', err6);
                res.status(500).send('Internal Server Error');
              } else {
                console.log('employer has signed up!', data);
                res.redirect('/');
              }
            });
          });
        }
      });
    }
  });
});


//OLD SIGN UP EMPLOYER ROUTE
// app.post('/signupEmployer', (req, res) => {
//   bcrypt.hash(req.body.password, 10, (err, hash) => {
//     if (err) {
//       console.log('ERROR signup in server: ', err);
//       res.sendStatus(500);
//     }
//     console.log('request body ', req.body);
//     const queryStr = `INSERT INTO employer (username, password, company_name, email, phone_number, city, state, country) values ("${req.body.username}", "${hash}", "${req.body.companyName}", "${req.body.email}", "${req.body.phoneNumber}", "${req.body.city}", "${req.body.state}", "${req.body.country}");`;
//     db.query(queryStr, (error, data) => {
//       if (error) {
//         console.log('err', error);
//       } else {
//         console.log('employer has signed up!', data);
//         res.redirect('/');
//       }
//     });
//   });
// });

app.post('/apply', (req, res) => {
  const queryStr = 'SELECT * FROM applicants_job_postings WHERE applicant_id=? AND job_posting_id=?;';
  const postId = JSON.parse(req.body.jobPostingId);
  db.query(queryStr, [req.user.id, postId], (error, data) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else if (data.length !== 0) {
      res.redirect(400, '/');
    } else {
      const queryStri = 'INSERT INTO applicants_job_postings VALUES (?, ?);';
      db.query(queryStri, [req.user.id, postId], (err, result) => {
        if (err) {
          res.status(500).send('Internal Server Error');
        }
        if (result) {
          res.sendStatus(202);
        }
      });
    }
  });
});

/*
 * route for searching
 * :query represents the value being searched
 * :fuzziness represents the number of possible misspelled characters
 * :size represents the amount of matched results to return
 */
app.get('/search/:query/:fuzziness/:size', (req, res) => {
  const fuzziness = req.params.fuzziness;
  const query = req.params.query;
  const size = req.params.size;
  const body = {
    size,
    from: 0,
    query: {
      match: {
        _all: {
          query,
          fuzziness,
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

// //update the picture
// cloudinary.uploader.upload("test1.jpg", function(result) {
//   console.log(result)
// });

elasticsearch.indexDatabase();
