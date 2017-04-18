const mysql = require('mysql');
const schema = require('./schema.js');
const Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

const databaseName = process.env.CLEARDB_DATABASE_URL?'heroku_2324d576fae6bbb':'stackedup'
const pool = mysql.createPool(
    process.env.CLEARDB_DATABASE_URL
||
{ 
    host: 'localhost',
    user: 'root',
    password: '',
    database: databaseName,
}
)


const getConn = function() {
    return pool.getConnectionAsync().disposer(function(connection) {
        connection.release();
    });
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
        .then(() => conn.queryAsync(`CREATE DATABASE ${databaseName}`))
        .then(() => conn.queryAsync(`USE ${databaseName}`))
        .then(() => conn.queryAsync(schema.applicants))
        // .then(() => conn.queryAsync(schema.showTables))
        // .then((results) =>(console.log('MMMMM  Tables =', results)))
        .then(() => conn.queryAsync(schema.employer))
        .then(() => conn.queryAsync(schema.job_postings))
        .then(() => conn.queryAsync(schema.skills))
        .then(() => conn.queryAsync(schema.applicants_skills))
        .then(() => conn.queryAsync(schema.applicants_job_postings))
        .then(() => conn.queryAsync(schema.alter_employer))
        // .then(() => conn.queryAsync(schema.addDemoApplicant))
        // .then(() => conn.queryAsync(schema.selectApplicants))})
        // .then((results) =>(console.log('ZZZZ  Applicants table =', results)))
        .then(()=> pool.query(`select * from applicants`, (x, y)=>(console.log(y))))
        .then(() => elasticsearch.indexDatabase());
        // .then((results)=>{console.log('RESULTS FROM APPLICANTS =',results)})
        // .catch((error) => console.log("ALERT ALERT ALERT XXXXXXXXXX Promise Rejected, Error = ", error));
        });
    }
}