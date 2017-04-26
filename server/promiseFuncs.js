const db = require('./db/index.js').connection;
const Promise = require("bluebird");
const cloudinary = require('cloudinary');
const bcrypt = require('bcrypt');

const checkUsername = (queryStr) => {
  return new Promise((resolve, reject) => {
    db.queryAsync(queryStr).then((data) => {
      // console.log('DATA', data);
      if (data.length !== 0) {
        const redirectUrl = `import React from 'react';
          const redirect = () => (
          <Redirect to=${req._parsedOriginalUrl.path}>);`;
          // console.log('REDIRECT ', redirectUrl);
        res.send(redirectUrl);
      } else {
        resolve();
      }
    });
  });
};

const uploadToCloudinaryAsync = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file, { resource_type: 'auto' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const hashedPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

const insertEmployerToDB = (queryStr, params) => {
  return new Promise((resolve, reject) => {
    db.queryAsync(queryStr, params);
  })
}


module.exports = {
  insertEmployerToDB,
  uploadToCloudinaryAsync,
  checkUsername,
  hashedPassword,
};
