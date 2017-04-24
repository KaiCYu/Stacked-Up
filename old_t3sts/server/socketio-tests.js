/* global define, it, describe, beforeEach, afterEach */
const chai = require('chai');
const io = require('socket.io-client');
const mocha = require('mocha');
const server = require('./../../server/server.js');

const expect = chai.expect;
let receiver;
let sender;

describe('Socket Connection', () => {
  beforeEach((done) => {
    sender = io('http://localhost:8000');
    receiver = io('http://localhost:8000');

    done();
  });

  afterEach((done) => {
    sender.disconnect();
    receiver.disconnect();

    done();
  });

  describe('Verify Connection', () => {
    it('Clients should receive a message when the "message" event is emitted', (done) => {
      const testMsg = 'I am alive';
      sender.emit('message', testMsg);
      receiver.on('message', (msg) => {
        expect(msg).to.equal(testMsg);
        done();
      });
    });
  });
});
