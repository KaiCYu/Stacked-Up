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
const SandBox = require('sandbox');
const path = require('path');
const db = require('./db/index.js').connection;
const dbName = require('./db/index.js').dbName;
const initDB = require('./db/index.js').initDB;
const elasticsearch = require('./elasticsearch/index.js');
// const cloudinary = require('cloudinary');
const schema = require('./db/schema.js');
const cloudinaryAPI = require('./../config/cloudinaryconfig.js');
const promiseUtil = require('./promiseFuncs');

initDB();

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
  console.log('serialize User in passport ====>', user ? user.username : '');
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('deserializeUser in passport', user ? user.username : '');
  let queryStr;
  if (user.type === 'applicant') {
    queryStr = `SELECT * FROM applicants WHERE id = "${user.id}";`;
  } else {
    queryStr = `SELECT * FROM employer WHERE id = "${user.id}";`;
  }
  db.query(queryStr, (err, userdata) => {
    done(err, userdata[0]);
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
      } else {
        return done(null, false);
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

app.get('/verifyLogin', (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.json(true);
  } else {
    res.json(false);
  }
});

app.get('/getCurrentUser', (req, res) => {
  // console.log('REQ.USER', req.user?req.user.username:'');
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
      for (let j = 0; j < data.length; j += 1) {
        const queryFiles = `SELECT * FROM applicant_files WHERE applicant_id = ${data[j].id};`;
        db.query(queryFiles, (err, result) => {
          for (let k = 0; k < result.length; k += 1) {
            if (result[k].type === 'resume') {
              data[j].resume = result[k].url;
            } else {
              data[j].coverletter = result[k].url;
            }
          }
          const users = Array.from(Object.keys(loggedInUsers));
          if (data[0]) {
            data[0].users = users;
          }
          console.log('data after adding users ->', data);
          res.json(data);
        });
      }
    }
  });
});

app.get('/getJobPostings', (req, res) => {
  const queryStr = 'select job_postings.*, employer.company_name from job_postings inner join employer on job_postings.employer_id = employer.id;';
  db.query(queryStr, (error, data) => {
    if (error) {
      console.log('failed to get job posting data', error);
      res.sendStatus(500);
    } else {
      if (req.user) {
        const queryAnotherStr = `SELECT * FROM applicants_job_postings WHERE applicant_id = '${req.user.id}';`;
        db.query(queryAnotherStr, (error, results) => {
          if (error) {
            console.log('failed to get applicant data from join table ', error);
            res.sendStatus(500);
          } else {
            for (let j = 0; j < data.length; j += 1) {
              for (let i = 0; i < results.length; i += 1) {
                if (results[i].job_posting_id === data[j].id) {
                  data[j].apply = true;
                }
              }
            }
          }
        });
      }
      console.log(data);
      res.send(data);
    }
  });
});

app.get('/getTopJobPostings', (req, res) => {
  const queryStr = 'select job_postings.*, employer.company_name from job_postings inner join employer on job_postings.employer_id = employer.id;';
  db.query(queryStr, (error, data) => {
    if (error) {
      res.status(500).send('Error on get getTopJobPostings');
      console.log('failed to get job posting data', error);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.get('/getTopApplicants', (req, res) => {
  db.query(schema.getTopApplicants, (error, data) => {
    if (error) {
      res.status(500).send('Error on get getTopApplicants');
      console.log('failed to get Top Applicants data', error);
    } else {
      // console.log(data);
      res.send(data);
    }
  });
});

app.post('/login', passport.authenticate('local'),
  (req, res) => {
    if (req.user) {
      res.send(req.user.username);
    } else {
      res.sendStatus(500);
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
  let applicantId;
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
        if (files[i] === 'resume') {  //resume
          resumeURL = values[i].secure_url;
        } else if (files[i] === 'coverLetter') {  //coverletter
          coverletterURL = values[i].secure_url;
        } else {  //profile picture
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

    const applicantValues = {
      username: req.body.username,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone_number: req.body.phoneNumber,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      // resume_url: resumeURL,
      // coverletter_url: coverletterURL,
      profile_pic_url: profilePicURL,
    };
    return db.queryAsyncQuestion(insertApplicant, applicantValues);
  })
  .then(() => {
    return db.queryAsync(`SELECT id FROM applicants WHERE username="${req.body.username}";`);
  })
  .tap((result) => {
    applicantId = result[0].id;
    // console.log('APPLICANT ID: ', applicantId);

    const insertApplicantResume = `INSERT INTO applicant_files (url, type, applicant_id) VALUES ("${resumeURL}", "resume", ${applicantId});`;

    return db.query(insertApplicantResume);
  })
  .then((result) => {
    const insertApplicantCoverLetter = `INSERT INTO applicant_files (url, type, applicant_id) VALUES ("${coverletterURL}, "coverletter", ${applicantId});`;

    return db.query(insertApplicantCoverLetter);
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

  const signupEmployer = async () => {
    try {
      const isUser = await promiseUtil.checkUsername(checkEmployerUser);
      console.log(req.body.logo)
      if (!isUser && req.body.logo !== '') {
        logoURL = await promiseUtil.uploadToCloudinaryAsync(req.body.logo);
        logoURL = logoURL.secure_url;
      }
      const hash = await promiseUtil.hashedPassword(req.body.password, 10);
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
      await db.queryAsyncQuestion(insertEmployer, values);

      console.log('employer has signed up!');
      res.redirect('/');
    } catch (error) {
      res.status(500).send('Internal Server Error', error);
    }
  };
  signupEmployer();
});

app.post('/uploadFile', (req, res) => {
  const username = req.body.username;
  const resumes = req.body.resumes || [];
  const coverLetters = req.body.coverLetters || [];
  const coverLettersPromise = [];
  const resumesPromise = [];
  // console.log('INSIDE UPLOAD FILE', req.user.id);

  //USING ASYNC/AWAIT
  const uploadFiles = async () => {
    try {
      coverLetters.forEach((coverLetter) => {
        coverLettersPromise.push(promiseUtil.uploadToCloudinaryAsync(coverLetter));
      });
      resumes.forEach((resume) => {
        resumesPromise.push(promiseUtil.uploadToCloudinaryAsync(resume));
      });

      const coverLetterURLS = await Promise.all(coverLettersPromise);
      // console.log(coverLetterURLS)
      const resumesURLS = await Promise.all(resumesPromise);
      // console.log(resumesURLS)
      const applicant = await db.queryAsync(`SELECT id FROM applicants WHERE username="${username}";`);
      const applicantID = applicant[0].id;

      // for (let i = 0; i < coverLetterURLS.length; i++) {
      //   let coverLetterQuery = `INSERT INTO applicant_files (url, type, applicant_id) VALUES ("${coverLetterURLS[i].secure_url}", "coverletter", ${applicantID});`;
      //   await db.queryAsync(coverLetterQuery);
      // }

      // for (let i = 0; i < resumesURLS.length; i++) {
      //   let resumeQuery = `INSERT INTO applicant_files (url, type, applicant_id) VALUES ("${resumesURLS[i].secure_url}", "resume", ${applicantID});`;
      //   await db.queryAsync(resumeQuery);
      // }

      await coverLetterURLS.forEach((cloudObj) => {
        const coverLetterQuery = `INSERT INTO applicant_files (url, type, applicant_id) VALUES ("${cloudObj.secure_url}", "coverletter", ${applicantID});`;
        db.queryAsync(coverLetterQuery);
      });

      await resumesURLS.forEach((cloudObj) => {
        const resumeQuery = `INSERT INTO applicant_files (url, type, applicant_id) VALUES ("${cloudObj.secure_url}", "resume", ${applicantID});`;
        db.queryAsync(resumeQuery);
      });

      console.log('files stored into DB!');
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send('Internal Server Error', error);
    }
  };

  if (coverLetters.length > 0 || resumes.length > 0) {
    uploadFiles();
  }
});

app.delete('/deleteFile', (req, res) => {
  const fileId = req.body.fileId;
  const deleteFile = async () => {
    try {
      const queryStr = `DELETE FROM applicant_files WHERE id=${fileId}`;
      await db.queryAsync(queryStr);
      console.log('deleted file from DB!');
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send('Internal Server Error', error);
    }
  };
  deleteFile();
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

app.get('/updateFiles', (req, res) => {
  console.log('REQ.USER.ID FROM UPDATE FILES:', req.user.id);
  // console.log('REQ.USER.ID FROM UPDATE FILES:', req);

  const queryApplicantFiles = `SELECT * FROM applicant_files WHERE \
  applicant_id=${req.user.id}`;
  const resultObj = {
    resumes: [],
    coverLetters: [],
  };

  db.query(queryApplicantFiles, (err, files) => {
    if (err) {
      console.log('error getting applicant files', err);
    }
    // console.log('FILES', files);
    resultObj.resumes = files.filter((file) => {
      if (file.type === 'resume') {
        return file;
      }
    });
    resultObj.coverLetters = files.filter((file) => {
      if (file.type === 'coverletter') {
        return file;
      }
    });
    res.json(resultObj);
  });

});


app.get('/getAppliedCompanies', (req, res) => {
  console.log('USER ID', req.user.id);
  const resultObj = {
    resumes: [],
    coverletters: [],
    companies: [],
  };
  const queryAppliedCompanies = `SELECT j.*, e.company_name FROM job_postings AS j, employer AS e WHERE j.employer_id = e.id AND j.id in (SELECT a.job_posting_id FROM applicants_job_postings AS a WHERE a.applicant_id = "${req.user.id}");`;

  const queryApplicantFiles = `SELECT * FROM applicant_files WHERE \
  applicant_id=${req.user.id}`;

  db.query(queryAppliedCompanies, (err, result) => {
    if (err) {
      console.log('error occured in getting appied company list', err);
    } else {
      resultObj.companies = result;
      db.query(queryApplicantFiles, (err2, files) => {
        if (err2) {
          console.log('error getting applicant files', err2);
        }
        // console.log('FILES', files);
        resultObj.resumes = files.filter((file) => {
          if (file.type === 'resume') {
            return file.url;
          }
        });
        resultObj.coverletters = files.filter((file) => {
          if (file.type === 'coverletter') {
            return file.url;
          }
        });
        res.json(resultObj);
      });
    }
  });
});

app.post('/codeTest', (req, res) => {
  console.log(req.body.snippet);
  const s = new SandBox();
  s.run(req.body.snippet, (output) => {
    console.log(output);
    res.send(output);
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

  elasticsearch.search(dbName, body)
  .then((searchResults) => {
    const newResults = searchResults.hits.hits.map((hit) => {
      const data = hit._source;
      if (data.username in loggedInUsers) {
        data.online = true;
      } else {
        data.online = false;
      }
      return data;
    });
    res.status(200).json(newResults);
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
  let msgContent = Object.assign( JSON.parse(JSON.stringify(schema.msgContent)),
    { subject: req.body.subject||req.body.prev_subject,
    message: req.body.msgContent, });
  db.querySet(schema.setMsgContent, msgContent)
  .then((result)=> {
    let msgContentInsertID = result[0]['LAST_INSERT_ID()'];
    let msgJoin = Object.assign( JSON.parse(JSON.stringify(schema.msgJoin)),
      { recipient: req.body.recipient,
      sender_applicants_id: req.body.sender_type==="applicant"?req.user.id:null,
      sender_employer_id: req.body.sender_type==="company"?req.user.id:null,
      message_content_id: msgContentInsertID,
      prev_message_id: req.body.prev_msgId&&req.body.prev_msgId.length>0?
      req.body.prev_msgId.lengthnull:null,
      recipient: req.body.recipient,
      mark_read: 0,
      send_date: null, });
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
      .then((message_content)=> Object.assign(message_join, message_content[0]))
      .then(()=>message_join.send_date=message_join.send_date.toString());
    }))
    .then(()=>messagesObject.receive = message_joins);

  })
  .then(()=>db.queryAsyncQuestion(msgJoinSenderQuery, id))
  .then((message_joins)=> {
    return Promise.all(message_joins.map(function(message_join) {
      return db.queryAsyncQuestion(schema.getMsgContent, message_join.message_content_id)
      .then((message_content)=> Object.assign(message_join, message_content[0]))
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
    console.log('=======================');
    console.log(message);
    console.log('=======================');
    const sendUpdateToUser = message.userInCallWith;
    const sender = message.user;
    const messageData = {
      type: 'updatedCode',
      updatedCode: message.updatedCode,
    };
    const loggedInUsersArray = Object.keys(loggedInUsers);
    loggedInUsersArray.forEach((user) => {
      if (user === sendUpdateToUser) {
        console.log("===============");
        console.log(loggedInUsers[user]);
        console.log("===============");
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

  });
});

// unhandled EndPoints
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../app/dist', 'index.html'));
});

app.get('/*', (req, res) => {
  res.redirect('/');
});


elasticsearch.indexDatabase();
exports.server = server;
