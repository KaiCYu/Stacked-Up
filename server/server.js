'use strict'; 

const Promise = require('bluebird');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const cookie = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const db = require('./db/index.js').connection;
const dbName = require('./db/index.js').dbName;
const initDB = require('./db/index.js').initDB;
initDB();
const elasticsearch = require('./elasticsearch/index.js');
// const cloudinary = require('cloudinary');
const schema = require('./db/schema.js')
const cloudinaryAPI = require('./../config/cloudinaryconfig.js');
const promiseUtil = require('./promiseFuncs');

const PORT = process.env.PORT || 8000;

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
  cookie: { name: 'StackedUp' } }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('serialize User in passport ====>', user?user.username:'');
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('deserializeUser in passport', user?user.username:'');
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
          console.log('passport err1', err1);
          return done(err1);
        }
        if (!user.length) {
          console.log('passport no such user', err1);
          return done(null, false);
        }
        return bcrypt.compare(password, user[0].password, (err2, res) => {
          if (res) {
            user[0].type = temp[1];
            done(null, user[0]);
          }
          console.log('passport password error', err1);
          done(null, false);
        });
      });
    } else {
      done(null, false);
    }
  }));


app.get('/hello', (req, res) => {
  const HelloWorld = function () {
    return new Promise (function(resolve, reject) {
      console.log('Hello World');
      resolve('bye');
    })
  }

  HelloWorld().then((greeting2) => {
    return new Promise ()
    console.log(greeting2);
  }).then(() => {

  })
});

app.get('/verifyLogin', (req, res) => {
  if (req.user) {
    res.json(true);
  } else {
    res.json(false);
  }
});

app.get('/getCurrentUser', (req, res) => {
  console.log('REQ.USER', req.user?req.user.username:'');
  if (req.user) {
    const currentUser = req.user;
    delete currentUser.password;
    res.json(currentUser);
  } else {
    res.sendStatus(500);
  }
});

app.get('/getApplicants', (req, res) => {
  const id = req.query.jobPosting_id;
  const queryStr = `SELECT * FROM applicants as a WHERE a.id in (SELECT j.applicant_id FROM applicants_job_postings AS j WHERE j.job_posting_id = "${id}");`;
  db.query(queryStr, (error, data) => {
    if (error) {
      console.log('failed to get applicants for this job', error);
    } else {
      for (let i = 0; i < data.length; i += 1) {
        delete data[i].password;
      }
      const users = Array.from(Object.keys(loggedInUsers));
      if (data[0]) {
        data[0].users = users;
      }
      console.log('data after adding users ->', data);
      res.json(data);
    }
  });
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
  console.log('--> logout user check', req.user);
  const username = req.user.username;
  delete loggedInUsers[username];
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });

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
  // res.redirect('/');
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
      // console.log('job posting successful!: ', data);
      res.redirect('/');

      // index elasticsearch with new applicant
      elasticsearch.indexDatabase();
    }
  });
});

app.post('/signupApplicant', (req, res) => {
  const checkApplicantUser = `SELECT * FROM applicants WHERE username="${req.body.username}";`;
  let resumeURL = null;
  let coverletterURL = null;
  let profilePicURL = null;
  const files = [];

  promiseUtil.checkUsername(checkApplicantUser)
  .then(() => {
    const promiseArray = [];

    if (req.body.resume) {
      promiseArray.push(promiseUtil.uploadToCloudinaryAsync(req.body.resume));
      files.push('resume');
    }
    if (req.body.coverLetter) {
      promiseArray.push(promiseUtil.uploadToCloudinaryAsync(req.body.coverLetter));
      files.push('coverLetter');
    }
    if (req.body.profilePhoto) {
      promiseArray.push(promiseUtil.uploadToCloudinaryAsync(req.body.profilePhoto));
      files.push('profilePhoto');
    }

    return Promise.all(promiseArray).then((values) => {
      // console.log('values from promise all', values);
      for (var i = 0; i < files.length; i++) {
        if (files[i] === 'resume') {
          resumeURL = values[i].secure_url;
        } else if (files[i] === 'coverLetter') {
          coverletterURL = values[i].secure_url;
        } else {
          profilePicURL = values[i].secure_url;
        }
      }
    });
  })
  .then(() => {
    return promiseUtil.hashedPassword(req.body.password, 10);
  })
  .then((hash) => {
    const insertApplicant = `INSERT INTO applicants SET ?`;
    const values = {
      username: req.body.username,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone_number: req.body.phoneNumber,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      resume_url: resumeURL,
      coverletter_url: coverletterURL,
      profile_pic_url: profilePicURL,
    };
    db.queryAsyncQuestion(insertApplicant, values);
  })
  .then(() => {
    console.log('applicant has signed up!');
    res.redirect('/');
  })
  .catch((error) => {
    res.status(500).send('Internal Server Error');
  });
});

app.post('/signupEmployer', (req, res) => {
  const checkEmployerUser = `SELECT * FROM employer WHERE username="${req.body.username}";`;
  let logoURL;

  promiseUtil.checkUsername(checkEmployerUser)
  .then(() => promiseUtil.uploadToCloudinaryAsync(req.body.logo))
  .then((logo) => {
    logoURL = logo.secure_url;
    return promiseUtil.hashedPassword(req.body.password, 10);
  })
  .then((hash) => {
    const insertEmployer = `INSERT INTO employer SET ?`;
    const values = {
      username: req.body.username,
      password: hash,
      company_name: req.body.companyName,
      email: req.body.email,
      phone_number: req.body.phoneNumber,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      logo_url: logoURL,
    };
    db.queryAsyncQuestion(insertEmployer, values);
  })
  .then(() => {
    console.log('employer has signed up!');
    res.redirect('/');

    // index elasticsearch with new applicant
    elasticsearch.indexDatabase();
  })
  .catch((error) => {
    res.status(500).send('Internal Server Error');
  });
});

app.post('/apply', (req, res) => {
  const postId = JSON.parse(req.body.jobPostingId);
  const queryStr = `SELECT * FROM applicants_job_postings WHERE applicant_id="${req.user.id}" AND job_posting_id="${postId}";`;
  db.query(queryStr, (error, data) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else if (data.length !== 0) {
      res.redirect(400, '/');
    } else {
      const queryStri = `INSERT INTO applicants_job_postings VALUES (${req.user.id}, ${postId});`;
      db.query(queryStri, (err, result) => {
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

app.get('/getAppliedCompanies', (req, res) => {
  const queryStr = `SELECT j.*, e.company_name FROM job_postings AS j, employer AS e WHERE j.employer_id = e.id AND j.id in (SELECT a.job_posting_id FROM applicants_job_postings AS a WHERE a.applicant_id = "${req.user.id}");`;
  db.query(queryStr, (err, result) => {
    if (err) {
      console.log('error occured in getting appied company list', err);
    }
    res.json(result);
  });
});

app.post('/codeTest', (req, res) => {
  console.log(req.body);
  const line = 'var func = function(test){\n  console.log("hello world!");\n};';
  req.body.snippet = line;
  res.send(req.body);
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

  elasticsearch.search(dbName, body)
  .then((results) => {
    // console.log("SEARCH RESULTS =", results);
    if (results[0]&& results[0].username) {
      results = results.map(function(applicant) {
        (applicant.username in loggedInUsers)?applicant.online=true
        :applicant.online=false;
        return applicant;
      });
      res.status(200).json(results);
    } else if (results&&results.length>0) {
      results = results.hits.hits.map(function(hit) {
        var applicant = hit._source;
        (applicant.username in loggedInUsers)?applicant.online=true
        :applicant.online=false;
        return applicant;
      });
      res.status(200).json(results);
    }
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
    var room = requestorID + calledID;
    wsClient.send(JSON.stringify({
      type: 'videoCallRequest',
      requestor: req.body.requestor,
      room: room,
    }));
  }
  res.status(200).send(room);
});


app.post('/sendMessage', (req, res) => {
  // console.log('post received to /sendMessage by, ', req.user);
  // console.log('AAAAA Message received to /messages POST // req.body = ', req.body)
  let msgContent = Object.assign( JSON.parse(JSON.stringify(schema.msgContent)),
    { subject: req.body.subject||req.body.prev_subject,
    message: req.body.msgContent, });
  db.querySet(schema.setMsgContent, msgContent)
  .then((result)=> {
    // console.log('\n\n\n RESULT', result);
    let msgContentInsertID = result[0]['LAST_INSERT_ID()'];
    // console.log('\n\n\n MSGCONTENTINSERTID', msgContentInsertID);
    let msgJoin = Object.assign( JSON.parse(JSON.stringify(schema.msgJoin)),
      { recipient: req.body.recipient,
      sender_applicants_id: req.body.sender_type==="applicant"?req.user.id:null,
      sender_employer_id: req.body.sender_type==="company"?req.user.id:null,
      message_content_id: msgContentInsertID,
      prev_message_id: req.body.prev_msgId.length>0?
      req.body.prev_msgId.lengthnull:null,
      recipient: req.body.recipient,
      mark_read: 0,
      send_date: null, });
    // console.log('\n\n\n MSGJOIN', msgJoin);
    return db.queryAsyncQuestion(schema.setMsgJoin, msgJoin)
    .then(()=>res.send('successfully submitted message to DB'));
  })
})


app.get('/getMessages', (req,res) => {
  var messagesObject = {receive:[], sent:[]};
  var id = req.user.id;  //need to secure this from user tampering with req.user
  if (req.query.userType&& req.query.userType=== 'applicant') {
    var recipientNameQuery = schema.getApplicantName;
    var msgJoinSenderQuery = schema.getMsgJoinByApplicantIDSender;
  } else if (req.query.userType&&req.query.userType === 'company') {
    var recipientNameQuery = schema.getEmployerName;
    var msgJoinSenderQuery = schema.getMsgJoinBySenderIDSender;
  }
  db.queryAsyncQuestion(recipientNameQuery, id)
  .then((result)=>result[0].username)
  .then((username)=>db.queryAsyncQuestion(schema.getMsgJoinByRecipient, username))
  .then((message_joins)=> {
    return Promise.all(message_joins.map(function(message_join) {
      if (message_join.sender_employer_id) {
        var querySender=schema.getEmployerName;
      } else if (message_join.sender_applicants_id) {
        var querySender=schema.getApplicantName;
      }
      return db.queryAsyncQuestion(querySender, message_join.sender_applicants_id||message_join.sender_employer_id)
      .then((sender)=>message_join.sender=sender[0].username)
      .then(()=>db.queryAsyncQuestion(schema.getMsgContent, message_join.message_content_id))
      .then((message_content)=> Object.assign(message_join, (({subject, message})=>({subject, message}))(message_content[0])))
      .then(()=>message_join.send_date=message_join.send_date.toString());
    }))
    .then(()=>messagesObject.receive = message_joins);
    // .then(()=>console.log(utility.formatMysqlTime(messagesObject.receive[0].send_date)))
    // .then(()=>console.log(messagesObject));

  })
  .then(()=>db.queryAsyncQuestion(msgJoinSenderQuery, id))
  .then((message_joins)=> {
    return Promise.all(message_joins.map(function(message_join) {
      return db.queryAsyncQuestion(schema.getMsgContent, message_join.message_content_id)
      .then((message_content)=> Object.assign(message_join, (({subject, message})=>({subject, message}))(message_content[0])))
      .then(()=>message_join.send_date=message_join.send_date.toString());
    }))
    .then(()=>messagesObject.sent = message_joins);
  })
  .then(()=>res.send(messagesObject));
});

app.post('/updateCode', (req, res) => {
  console.log(req.body);
});

const server = http.createServer(app);

server.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server now listening on port ${PORT}`);
  }
});
const wss = new WebSocket.Server({ server });

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
    const message = JSON.parse(recObj);
    const sendUpdateToUser = message.userInCallWith;
    const messageData = {
      type: 'updatedCode',
      updatedCode: message.updatedCode,
    };
    const loggedInUsersArray = Object.keys(loggedInUsers);
    loggedInUsersArray.forEach((user) => {
      if (user === sendUpdateToUser) {
        loggedInUsers[user][1].send(JSON.stringify(messageData));
      }
    });
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

elasticsearch.indexDatabase();
exports.server = server;
