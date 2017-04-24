/* global define, it, describe, beforeEach, afterEach */
const Promise = require('bluebird');
const chai = require('chai');
const express = require('express');
const mysql = require('mysql');
const request = require('request');

const expect = chai.expect;

describe('Search Applicants', function() {
  const database = 'stackedup';
  let db;

  // beforeEach(function(done) {
  //   const connection = mysql.createConnection({
  //     user: 'root',
  //     password: '',
  //     database,
  //   });

  //   db = Promise.promisifyAll(connection, { multiArgs: true });
  //   db.connectAsync()
  //   .then(() => db.queryAsync('DELETE FROM applicants'))
  //   .then(() => db.queryAsync('INSERT INTO applicants (username, firstname, password, phone_number, email, resume_url, photo_url)' +
  //     'VALUES ("qwer", "qwer", "qwer", 1947193442, "gabrielscerteza@gmail.com", "example.com", "example2.com")'
  //   ))
  //   .then(() => db.queryAsync('SELECT * FROM applicants WHERE username="qwer"'))
  //   .then((result) => {
  //     const user = result[0];

  //     // index for elasticsearch
  //     esConfig.bulkIndex('stackedup', 'applicants', user)
  //     .then(() => done());
  //   });
  // });

  // afterEach(function() {
  //   db.end();
  // });

  it('should have the job posting info', function(done) {
    // job posting info should be given on top of the page
    function (done) {
      expect(this.state.info).to.not.equal(null);
    }
  });

  // it('should render list of users on each entry',
  //   function(done) {
      
  //   }
  // );

  // it('should not match the username with three misspelled letters if a fuzziness of three is provided',
  //   function(done) {
  //     request.get('http://localhost:8000/search/gab/2/1', (error, searchResult) => {
  //       const body = JSON.parse(searchResult.body);
  //       const userResult = body[0];
  //       expect(body).to.not.equal(null);
  //       expect(body.length).to.equal(0);
  //       done();
  //     });
  //   }
  // );
});
