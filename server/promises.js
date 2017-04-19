const db = require('./db/index.js').connection;
const Promise = require("bluebird");
const cloudinary = require('cloudinary');

// db = Promise.promisifyAll(db, { multiArgs: true });

const checkUsername = (queryStr) => {
  console.log('QUERY STRING: ', queryStr);
  return new Promise((resolve, reject) => {
    console.log('inside promise.js')
    db.queryAsync(queryStr).then((data) => {
      console.log('inside db.queryAsync');
      console.log('DATA', data);
      if (data.length !== 0) {
        const redirectUrl = `import React from 'react';
          const redirect = () => (
          <Redirect to="${req._parsedOriginalUrl.path}">);`;
          // console.log('REDIRECT ', redirectUrl);
        res.send(redirectUrl);
      } else {
        resolve();
      }
    })
  });
}

const uploadToCloudinaryAsync = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file, {resource_type: 'auto'}, (result) => {
      resolve(result);
    })
  })
}

// const insertEmployer = `INSERT INTO employer (username, password, company_name, email, phone_number, city, state, country, logo_url) values
//   ("${req.body.username}", "${hash}", "${req.body.companyName}",
//   "${req.body.email}", "${req.body.phoneNumber}", "${req.body.city}", "${req.body.state}", "${req.body.country}", "${image.secure_url}"
// );`;

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
