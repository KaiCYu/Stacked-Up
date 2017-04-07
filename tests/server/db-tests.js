// test file for database
/* global define, it, describe, beforeEach, afterEach */
const chai = require('chai');
const express = require('express');
const mysql = require('mysql');
const schema = require('./../../server/db/schema.js');

const expect = chai.expect;

describe('Database', () => {
  const database = 'stackedup';
  let db;

  beforeEach((done) => {
    db = mysql.createConnection({
      user: 'root',
      password: '',
      database,
    });
    db.connect();
  });

  afterEach(() => {
    db.end();
  });
});
