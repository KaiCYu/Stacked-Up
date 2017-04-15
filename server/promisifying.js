

app.post('/signupApplicant', upload.any(), (req, res) => {

});



// break down all async fnc
// create new promise using bluebird
// chaining promises

const checkExistingUsername = () => {
  let queryStr = 'SELECT * FROM applicants WHERE username=?;';
  db.query(queryStr, req.body.username, (err1, data, fields) => {
    if (err1) {
      console.log(err1);
      res.status(500).send('Internal Server Error');
    } else if (data.length !== 0) {
      // case when no such your exists
      const redirectUrl = `import React from 'react';
        const redirect = () => (
        <Redirect to="${req._parsedOriginalUrl.path}">);`;
      res.send(redirectUrl);
    } 
  });
}

const uploadPicture = () => {
  cloudinary.v2.uploader.upload(`${req.body.profilePhoto}`);
}

const uploadResume = () => {
  cloudinary.v2.uploader.upload(`${req.body.resume}`, { resource_type: 'raw' });
}

const uploadCoverLetter = () => {
  cloudinary.v2.uploader.upload(`${req.body.coverLetter}`,{resource_type: 'raw' });
}

const hashPassword = () => {
  bcrypt.hash(req.body.password, 10);
};

const insertApplicantToDB = (hash) => {
  queryStr = `INSERT INTO applicants (username, password, firstname, lastname, email, phone_number, city, state, country, profile_pic_url, resume_url, coverletter_url) values 
    ("${req.body.username}", "${hash}", "${req.body.firstName}", "${req.body.lastName}",
    "${req.body.email}", "${req.body.phoneNumber}", "${req.body.city}", "${req.body.state}", "${req.body.country}", "${image.secure_url}", "${resume.secure_url}", "${coverLetter.secure_url}"
    );`;
  db.query(queryStr, (err6, data) => {
    if (err6) {
      console.log('err', err6);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('applicant has signed up!', data);
      res.redirect('/');
    }
  });
};


const insertApplicantToDBAsync = Promise.promisify(insertApplicantToDB);
const hashPasswordAsync = Promise.promisify(hashPassword);
const uploadCoverLetterAsync = Promise.promisify(uploadCoverLetter);
const uploadResumeAsync = Promise.promisify(uploadResume);
const uploadPictureAsync = Promise.promisify(uploadPicture);
const checkExistingUsernameAsync = Promise.promisify(checkExistingUsername);

