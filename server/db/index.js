const mysql = require('mysql');
const schema = require('./schema.js');
const demo = require('./demo.js')
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


const multiQuery = function(paramsArray, command, conn) {
  var i = 0;
  // var dataHold = {};
  var recursivequery = function(param) {
    if (param) {
      return conn.queryAsync(command, param).then((result)=>{
        if (paramsArray[i+1]) {
          // console.log('Param = ', param)
          i++;
          return recursivequery(paramsArray[i])
        } else {
          return null;
        }
      })
    }
  }
  return recursivequery(paramsArray[0])
}

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
        .catch((error) => console.log("ALERT ALERT ALERT XXXXXXXXXX Promise Rejected, Error = ", error))
        });
    } else {
      Promise.using(getConn(), function(conn) {
          return conn.queryAsync(`DROP DATABASE IF EXISTS ${databaseName}`)
        .then(()=> conn.queryAsync(`CREATE DATABASE ${databaseName}`))
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
        //demo. Data:
        // .then(()=>multiQueryInside(demo.MultiQuery2, demo.MultiParams2, conn))
        .then(()=>multiQuery(demo.employer, schema.setNewEmployer, conn))
        .then(()=>multiQuery(demo.applicants, schema.setNewApplicant, conn))
        .then(()=>multiQuery(demo.jobPost, schema.setNewJobPost, conn))
        .then(()=> conn.queryAsync(schema.setNewApplicantFile, demo.Resume))
        .then(()=> conn.queryAsync(schema.setNewApplicantFile, demo.CoverLetter))
        // The following sends a message from an employer to 3 applicants
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


