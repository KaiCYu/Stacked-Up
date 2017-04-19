const db = require('./db/index.js').connection;
const Promise = require("bluebird");
const cloudinary = require('cloudinary');
// const cloudinary = Promise.promisify(require('cloudinary'));
// db = Promise.promisifyAll(db, { multiArgs: true });

const checkUsername = (queryStr) => {
  return new Promise((resolve, reject) => {
    db.queryAsync(queryStr).then((data) => {
        const redirectUrl = `import React from 'react';
          const redirect = () => (
          <Redirect to="${req._parsedOriginalUrl.path}">);`;
        res.send(redirectUrl);
      } else {
        resolve();
      }
    })
  });
}

const uploadToCloudinaryAsync = (file) => {
  return new Promise((resolve, reject) => {
      if (result) {
        resolve(result);
        console.log('error');
        reject(error);
    });
  });
};
const insertEmployerToDB = (queryStr) => {
  return new Promise((resolve, reject) => {
    db.queryAsync(queryStr);
  })
}

module.exports = {
  insertEmployerToDB,
  uploadToCloudinaryAsync,
  checkUsername,
};
