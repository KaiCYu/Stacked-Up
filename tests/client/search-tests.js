// test file for search endpoint
/* global define, it, describe, beforeEach, afterEach */
const Promise = require('bluebird');
const chai = require('chai');
const express = require('express');
const mysql = require('mysql');
const request = require('request');
const esConfig = require('./../../server/elasticsearch/index.js');

const expect = chai.expect;

describe('Search Applicants', function() {
  const database = 'stackedup';
  let db;

  beforeEach(function(done) {
    const connection = mysql.createConnection({
      user: 'root',
      password: '',
      database,
    });

    db = Promise.promisifyAll(connection, { multiArgs: true });
    db.connectAsync()
    .then(() => db.queryAsync('DELETE FROM applicants'))
    .then(() => db.queryAsync('INSERT INTO applicants (username, firstname, password, phone_number, email, resume_url, photo_url)' +
      'VALUES ("gabece", "gabriel", "password", 1947193442, "gabrielscerteza@gmail.com", "example.com", "example2.com")'
    ))
    .then(() => db.queryAsync('SELECT * FROM applicants WHERE username="gabece"'))
    .then((result) => {
      const user = result[0];

      // index for elasticsearch
      esConfig.bulkIndex('stackedup', 'applicants', user)
      .then(() => done());
    });
  });

  afterEach(function() {
    db.end();
  });

  it('should match the username if searched exactly', function(done) {
    // timeout required because it takes a bit of time for the index to be available
    // only required for the first test because a one-second delay is required for the entire index,
    // so once elasticsearch has finished indexing, all tests should be able to access the index

    setTimeout(() => {
      request.get('http://localhost:8000/search/gabece/0/1', (error, searchResult) => {
        const body = JSON.parse(searchResult.body);
        const userResult = body[0];
        expect(body).to.not.equal(null);
        expect(body.length).to.equal(1);
        expect(userResult.username).to.equal('gabece');
        expect(userResult.firstName).to.equal('gabriel');
        expect(userResult.password).to.equal('password');
        expect(userResult.email).to.equal('gabrielscerteza@gmail.com');
        done();
      });
    }, 1000);
  });

  it('should match the username with two misspelled letters if a fuzziness of two is provided',
    function(done) {
      request.get('http://localhost:8000/search/gabe/2/1', (error, searchResult) => {
        const body = JSON.parse(searchResult.body);
        const userResult = body[0];
        expect(body).to.not.equal(null);
        expect(body.length).to.equal(1);
        expect(userResult.username).to.equal('gabece');
        expect(userResult.firstName).to.equal('gabriel');
        expect(userResult.password).to.equal('password');
        expect(userResult.email).to.equal('gabrielscerteza@gmail.com');
        done();
      });
    }
  );

  it('should not match the username with three misspelled letters if a fuzziness of three is provided',
    function(done) {
      request.get('http://localhost:8000/search/gab/2/1', (error, searchResult) => {
        const body = JSON.parse(searchResult.body);
        const userResult = body[0];
        expect(body).to.not.equal(null);
        expect(body.length).to.equal(0);
        done();
      });
    }
  );
});
