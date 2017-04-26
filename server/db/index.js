const mysql = require('mysql');
const schema = require('./schema.js');
const Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

const databaseName = process.env.CLEARDB_DATABASE_URL ? 'heroku_2324d576fae6bbb':'stackedup';
const pool = mysql.createPool(
    process.env.CLEARDB_DATABASE_URL
||
      {
        host: 'localhost',
        user: 'root',
        password: '',
        database: databaseName,
      });

const getConn = function() {
  return pool.getConnectionAsync().disposer(function(connection) {
    connection.release();
  });
};

pool.queryAsync = function (command) {
  return Promise.using(getConn(), function(conn) {
    return conn.queryAsync(command);
  });
};

pool.queryAsyncQuestion = function (command, query) {
  return Promise.using(getConn(), function(conn) {
    return conn.queryAsync(command, query);
  });
};

pool.querySet = function (command, query) {
    return Promise.using(getConn(), function(conn) {
    return conn.queryAsync(command, query)
    .then(()=>conn.queryAsync(schema.LASTINSERT))   
    .catch((error)=>(console.log(error)))
    });
};

pool.query = function (command, cb) {
  return Promise.using(getConn(), function(conn) {
      return conn.queryAsync(command)
    .then((results)=>cb?cb(null, results):null)
    .catch((error)=>(console.log(error)))
  });
};

module.exports.dbName = databaseName;
module.exports.connection = pool;
const elasticsearch = require('../elasticsearch/index.js');


module.exports.initDB = function() {
  if (process.env.DATABASE_URL) {
      Promise.using(getConn(), function(conn) {
          return conn.queryAsync(schema.applicants_job_postingsDrop)
        .then(()=> conn.queryAsync(schema.messages_joinDrop))
        .then(()=> conn.queryAsync(schema.applicant_filesDrop))
        .then(()=> conn.queryAsync(schema.messages_contentDrop))
        .then(()=> conn.queryAsync(schema.applicants_skillsDrop))
        .then(()=> conn.queryAsync(schema.skillsDrop))
        .then(()=> conn.queryAsync(schema.job_postingsDrop))
        .then(()=> conn.queryAsync(schema.employerDrop))
        .then(()=> conn.queryAsync(schema.applicantsDrop))
        .then(()=> conn.queryAsync(schema.applicants))
        .then(()=> conn.queryAsync(schema.employer))
        .then(()=> conn.queryAsync(schema.job_postings))
        .then(()=> conn.queryAsync(schema.skills))
        .then(()=> conn.queryAsync(schema.applicants_skills))
        .then(()=> conn.queryAsync(schema.applicants_job_postings))
        .then(()=> conn.queryAsync(schema.applicant_files))
        .then(()=> conn.queryAsync(schema.messages_content))
        .then(()=> conn.queryAsync(schema.messages_join))
        .then(()=> conn.queryAsync(schema.alter_employer))
        // .then(()=> conn.queryAsync(schema.addDemoApplicant))
        // .then(()=> conn.queryAsync(schema.selectApplicants))})
        // .then((results)=> (console.log('ZZZZ  Applicants table =', results)))
        // .using(getConn(), (conn)=> elasticsearch.indexDatabase())
        .catch((error) => console.log("ALERT ALERT ALERT XXXXXXXXXX Promise Rejected, Error = ", error))
        });
    } else {
      Promise.using(getConn(), function(conn) {
          return conn.queryAsync(`DROP DATABASE IF EXISTS ${databaseName}`)
        .then(()=> conn.queryAsync(`CREATE DATABASE ${databaseName}`))
        .then(()=> conn.queryAsync(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME ='${databaseName}';`))
        .then((result)=> console.log(result))
        .then(()=> conn.queryAsync(`USE ${databaseName}`))
        .then(()=> conn.queryAsync(schema.applicants))
        .then(()=> conn.queryAsync(schema.employer))
        .then(()=> conn.queryAsync(schema.job_postings))
        .then(()=> conn.queryAsync(schema.skills))
        .then(()=> conn.queryAsync(schema.applicants_skills))
        .then(()=> conn.queryAsync(schema.applicants_job_postings))
        .then(()=> conn.queryAsync(schema.applicant_files))
        .then(()=> conn.queryAsync(schema.messages_content))
        .then(()=> conn.queryAsync(schema.messages_join))
        .then(()=> conn.queryAsync(schema.alter_employer))
        //
        //Demo Data:
        // The following sends a message from an employer to 3 applicants
        .then(()=> conn.queryAsync(schema.setNewEmployer, demoEmployer1))
        .then(()=> conn.queryAsync(schema.setNewEmployer, demoEmployer2))
        .then(()=> conn.queryAsync(schema.setNewApplicant, demoAppicant1))
        .then(()=> conn.queryAsync(schema.setNewApplicant, demoAppicant2))
        .then(()=> conn.queryAsync(schema.setNewApplicant, demoAppicant3))
        .then(()=> conn.queryAsync(schema.setNewApplicantFile, demoResume))
        .then(()=> conn.queryAsync(schema.setNewApplicantFile, demoCoverLetter))
        .then(()=> conn.queryAsync(schema.addDemoMessageContent1))
        .then(()=> conn.queryAsync(schema.LASTINSERT))
        .then((result)=> { 
          const msgContentInsertID = result[0]['LAST_INSERT_ID()'];
          return  conn.queryAsync(schema.getEmployerID, 'hackreactor')
            .then((result)=> {
              const employerID = result[0].id;
              const demoMsg = Object.assign(
                    JSON.parse(JSON.stringify(schema.msgJoin)), 
                  { recipient: 'bobs', 
                    sender_employer_id: employerID,
                    message_content_id: msgContentInsertID, });
              return conn.queryAsync(schema.setMsgJoin, demoMsg)
                .then(()=>Object.assign(demoMsg, {recipient: 'marks'}))
                .then(()=>conn.queryAsync(schema.setMsgJoin, demoMsg))
                .then(()=>Object.assign(demoMsg, {recipient: 'toms'}))
                .then(()=>conn.queryAsync(schema.setMsgJoin, demoMsg))
            });
        })
        // The following sends a reply from the last recipient back to the employer
        .then(()=> conn.queryAsync(schema.LASTINSERT))
        .then((result)=> {
          const lastMsgInsertID = result[0]['LAST_INSERT_ID()'];  // previous Msg ID
          return conn.queryAsync(schema.addDemoMessageContentReply) // Reply Content
            .then(()=> conn.queryAsync(schema.LASTINSERT))
            .then((result)=> {
              const replyMsgContentId = result[0]['LAST_INSERT_ID()'];
              return conn.queryAsync(schema.getMsgJoin, lastMsgInsertID) // previous Msg Join details
                .then((result)=> {
                  const employerId = result[0].sender_employer_id;
                  const applicantName = result[0].recipient;
                  const prev = result[0].id;
                  return conn.queryAsync(schema.getEmployerName, employerId)
                    .then((result)=> {
                      const senderName = result[0].username;
                      return conn.queryAsync(schema.getApplicantID, applicantName)
                        .then((result)=> {
                          const applicantId = result[0].id;
                          const demoMsgReply = Object.assign(
                                JSON.parse(JSON.stringify(schema.msgJoin)), 
                              { recipient: senderName, 
                                prev_message_id: prev,
                                sender_applicants_id: applicantId,
                                message_content_id: replyMsgContentId, });
                          return conn.queryAsync(schema.setMsgJoin, demoMsgReply)
                        })
                    })
                })
            })
        })
        .then(()=> elasticsearch.indexDatabase())
        });
    }
}

const demoAppicant1 = Object.assign(
    JSON.parse(JSON.stringify(schema.newApplicant)), 
  { id: null,
    username: 'bobs',
    password: '$2a$10$h8sw.jt81MP/AlhpBHgtUu/84kAHw.Cg0ACZIGbNn/CQCUSbshzOK',
    firstName: 'Bobs',
    lastName: 'UpAndDownInTheWater',
    email: 'bobs@gmail.com',
    phone_number: '(123)456-7890',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    profile_pic_url: 'https://res.cloudinary.com/dse6qhxk5/image/upload/v1492581508/imcaugvc0sdkkxmvuzma.png',
  });

const demoAppicant2 = Object.assign(
    JSON.parse(JSON.stringify(schema.newApplicant)), 
  { id: null,
    username: 'marks',
    password: '$2a$10$h8sw.jt81MP/AlhpBHgtUu/84kAHw.Cg0ACZIGbNn/CQCUSbshzOK',
    firstName: 'Marks',
    lastName: 'OnYourShirt',
    email: 'marks@gmail.com',
    phone_number: '(123)456-7891',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    profile_pic_url: 'https://res.cloudinary.com/dse6qhxk5/image/upload/v1492581508/imcaugvc0sdkkxmvuzma.png',
  });

const demoAppicant3 = Object.assign(
    JSON.parse(JSON.stringify(schema.newApplicant)), 
  { id: null,
    username: 'toms',
    password: '$2a$10$h8sw.jt81MP/AlhpBHgtUu/84kAHw.Cg0ACZIGbNn/CQCUSbshzOK',
    firstName: 'Toms',
    lastName: 'Peeping',
    email: 'toms@gmail.com',
    phone_number: '(123)456-7892',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    profile_pic_url: 'https://res.cloudinary.com/dse6qhxk5/image/upload/v1492581508/imcaugvc0sdkkxmvuzma.png',
  });

const demoEmployer1 = Object.assign(
    JSON.parse(JSON.stringify(schema.newEmployer)),
  { id: null,
    username: 'hackreactor',
    password: '$2a$10$h8sw.jt81MP/AlhpBHgtUu/84kAHw.Cg0ACZIGbNn/CQCUSbshzOK',
    company_name: 'Hack Reactor',
    email: 'awesome@hackreactor.com',
    phone_number: '(987)654-3210',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    logo_url: 'https://res.cloudinary.com/dse6qhxk5/image/upload/v1492581508/imcaugvc0sdkkxmvuzma.png',
    job_postings_id: null });

const demoEmployer2 = Object.assign(
    JSON.parse(JSON.stringify(schema.newEmployer)),
  { id: null,
    username: 'apple',
    password: '$2a$10$h8sw.jt81MP/AlhpBHgtUu/84kAHw.Cg0ACZIGbNn/CQCUSbshzOK',
    company_name: 'apple',
    email: 'apple@apple.com',
    phone_number: '(650)650-6500',
    city: 'Cupertino',
    state: 'CA',
    country: 'USA',
    logo_url: 'https://res.cloudinary.com/dse6qhxk5/image/upload/v1492581508/imcaugvc0sdkkxmvuzma.png',
    job_postings_id: null });

const demoResume = Object.assign(
  JSON.parse(JSON.stringify(schema.newApplicantFile)),
  { id: null,
    url: 'https://res.cloudinary.com/dse6qhxk5/image/upload/v1492897363/ilq6ifmqammkpzlwuxjs.jpg',
    type: 'resume',
    applicant_id: 3,
  });


const demoCoverLetter = Object.assign(
  JSON.parse(JSON.stringify(schema.newApplicantFile)),
  { id: null,
    url: 'https://res.cloudinary.com/dse6qhxk5/image/upload/v1492897363/ilq6ifmqammkpzlwuxjs.jpg',
    type: 'coverletter',
    applicant_id: 3,
  });
