const mysql = require('mysql');
const schema = require('./schema.js');
const Promise = require('bluebird');

const database = 'stackedup';

// Create a database connection and export it from this file.
exports.connection = mysql.createConnection({
  user: 'root',
  password: '',
});

const db = Promise.promisifyAll(exports.connection, { multiArgs: true });

db.connectAsync()
//   .then(() => db.queryAsync(`DROP DATABASE IF EXISTS ${database}`))
//   .then(() => db.queryAsync(`CREATE DATABASE ${database}`))
  .then(() => db.queryAsync(`USE ${database}`))
//   .then(() => db.queryAsync(schema.applicants))
//   .then(() => db.queryAsync(schema.employer))
//   .then(() => db.queryAsync(schema.job_postings))
//   .then(() => db.queryAsync(schema.skills))
//   .then(() => db.queryAsync(schema.applicants_skills))
//   .then(() => db.queryAsync(schema.applicants_job_postings))
//   .then(() => db.queryAsync(schema.alter_employer));
