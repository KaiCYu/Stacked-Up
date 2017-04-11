// test file for search endpoint
/* global define, it, describe, beforeEach, afterEach */
const Promise = require('bluebird');
const chai = require('chai');
const express = require('express');
const mysql = require('mysql');
const request = require('request');
const esConfig = require('./../../server/elasticsearch/index.js');

const expect = chai.expect;

describe('Search Applicants', () => {
  const database = 'stackedup';
  let db;

  beforeEach((done) => {
    const connection = mysql.createConnection({
      user: 'root',
      password: '',
      database,
    });

    db = Promise.promisifyAll(connection, { multiArgs: true });
    db.connectAsync()
    .then(() => db.queryAsync('DELETE FROM applicants'))
    .then(() => done());
  });

  afterEach(() => {
    db.end();
  });

  it('should match the username if searched exactly', (done) => {
    db.queryAsync('INSERT INTO applicants (username, fullname, password, phone_number, email, resume_url, photo_url)' +
      'VALUES ("gabece", "gabriel certeza", "password", 1947193442, "gabrielscerteza@gmail.com", "example.com", "example2.com")'
    )
    .then(() => db.queryAsync('SELECT * FROM applicants WHERE username="gabece"'))
    .then((result) => {
      const user = result[0];
      // index for elasticsearch
      esConfig.bulkIndex('stackedup', 'applicants', user, () => {
        request.get('http://localhost:8000/search/applicants/username/gabece/0/1', (error, searchResult) => {
          const body = JSON.parse(searchResult.body);
          const userResult = body[0];
          expect(body).to.not.equal(null);
          expect(body.length).to.equal(1);
          expect(userResult.username).to.equal('gabece');
          expect(userResult.fullname).to.equal('gabriel certeza');
          expect(userResult.password).to.equal('password');
          expect(userResult.email).to.equal('gabrielscerteza@gmail.com');
          done();
        });
      });
    });
  });

  it('should match the username with two misspelled letters if a fuzziness of two is provided', (done) => {
    db.queryAsync('INSERT INTO applicants (username, fullname, password, phone_number, email, resume_url, photo_url)' +
      'VALUES ("gabece", "gabriel certeza", "password", 1947193442, "gabrielscerteza@gmail.com", "example.com", "example2.com")'
    )
    .then(() => db.queryAsync('SELECT * FROM applicants WHERE username="gabece"'))
    .then((result) => {
      const user = result[0];

      // index for elasticsearch
      esConfig.bulkIndex('stackedup', 'applicants', user);
      request.get('http://localhost:8000/search/applicants/username/gabe/2/1', (error, searchResult) => {
        const body = JSON.parse(searchResult.body);
        const userResult = body[0];
        expect(body).to.not.equal(null);
        expect(body.length).to.equal(1);
        expect(userResult.username).to.equal('gabece');
        expect(userResult.fullname).to.equal('gabriel certeza');
        expect(userResult.password).to.equal('password');
        expect(userResult.email).to.equal('gabrielscerteza@gmail.com');
        done();
      });
    });
  });
});
