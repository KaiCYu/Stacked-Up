const Promise = require('bluebird');
const chai = require('chai');
const expect = chai.expect
const express = require('express');
const mysql = require('mysql');

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

const databaseName = process.env.CLEARDB_DATABASE_URL?'heroku_2324d576fae6bbb':'stackedup'
const db = require('../server/db/index.js').connection;


describe('Test database: ', function() {
  console.log('\n\n\nAAAAAA TESTING :) \n\n\n')
  it('database should exist', function(done) {  
    db.queryAsync(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME ='${databaseName}';`)
    .then((result)=>Promise.resolve(expect(result[0].SCHEMA_NAME).to.equal('stackedup')))
    .then(()=>done())
    .catch((e)=>done(e))
  });

  it('bobs should exist', function(done) {
    db.queryAsync(`SELECT username FROM applicants WHERE username='bobs';`)
    .then((result)=>Promise.resolve(expect(result[0].username).to.equal('bobs')))
    .then(()=>done())
    .catch((e)=>done(e))

    // expect('bobs').to.equal('bobs')
    // done()
  });

});