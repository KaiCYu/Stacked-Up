// create database queries
module.exports = {
  LASTINSERT: `Select LAST_INSERT_ID();`,
  setNewApplicant: `INSERT INTO applicants SET ?`,
  newApplicant: {
    id: null,
    username: null,
    password: null,
    firstName: null,
    lastName: null,
    email: null,
    phone_number: null,
    city: null,
    state: null,
    country: null,
    profile_pic_url: null,
  },
  getApplicantID: `Select id FROM applicants WHERE username=?;`,
  getApplicantName: `Select username FROM applicants WHERE id=?;`,
  getTopApplicants: `Select * FROM applicants;`,
  applicantsDrop: 'DROP TABLE IF EXISTS applicants;',
  applicants: 'CREATE TABLE IF NOT EXISTS applicants (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'username VARCHAR(255),' +
  'password CHAR(255),' +
  'firstName VARCHAR(255),' +
  'lastName VARCHAR(255),' +
  'email VARCHAR(255),' +
  'phone_number VARCHAR(20),' +
  'city VARCHAR(255),' +
  'state VARCHAR(255),' +
  'country VARCHAR(255),' +
  'profile_pic_url VARCHAR(255),' +
  'UNIQUE INDEX(username)' +
  ')',
  applicantsFiles: 'CREATE TABLE IF NOT EXISTS applicant_files (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'url VARCHAR(255),' +
  'type VARCHAR(255),' +
  'applicant_id int,' +
  'UNIQUE INDEX(username)' +
  'FOREIGN KEY (applicant_id REFERENCES applicants(id)' +
  ')',
  setNewEmployer: `INSERT INTO employer SET ?`,
  newEmployer: {
    id: null,
    username: null,
    password: null,
    company_name: null,
    email: null,
    phone_number: null,
    city: null,
    state: null,
    country: null,
    logo_url: null,
    job_postings_id: null,
  },
  getEmployerID: `Select id FROM employer WHERE username=?;`,
  getEmployerName: `Select username FROM employer WHERE id=?`,
  employerDrop: 'DROP TABLE IF EXISTS employer;',
  employer: 'CREATE TABLE IF NOT EXISTS employer (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'username VARCHAR(255),' +
  'password VARCHAR(255),' +
  'company_name VARCHAR(255),' +
  'email VARCHAR(255),' +
  'phone_number VARCHAR(20),' +
  'city VARCHAR(255),' +
  'state VARCHAR(255),' +
  'country VARCHAR(255),' +
  'logo_url VARCHAR(255),' +
  'job_postings_id INT' +
  ')',
  job_postingsDrop: 'DROP TABLE IF EXISTS job_postings;',
  job_postings: 'CREATE TABLE IF NOT EXISTS job_postings (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'position VARCHAR(255),' +
  'description VARCHAR(255),' +
  'location VARCHAR(255),' +
  'salary INT,' +
  'post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
  'employer_id INT,' +
  'FOREIGN KEY (employer_id) REFERENCES employer(id)' +
  ')',
  setNewJobPost: `INSERT INTO job_postings SET ?`,
  job_post: {
    id: null,
    position: null,
    description: null,
    location: null,
    salary: null,
    post_date: null,
    employer_id: null,
  },
  applicant_filesDrop: 'DROP TABLE IF EXISTS applicant_files;',
  applicant_files: 'CREATE TABLE IF NOT EXISTS applicant_files (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'url VARCHAR(255),' +
  'type VARCHAR(20),' +
  'applicant_id INT,' +
  'FOREIGN KEY (applicant_id) REFERENCES applicants(id)' +
  ')',
  applicant_filesDrop: 'DROP TABLE IF EXISTS applicant_files;',
  applicant_files: 'CREATE TABLE IF NOT EXISTS applicant_files (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'url VARCHAR(255),' +
  'type VARCHAR(20),' +
  'applicant_id INT,' +
  'FOREIGN KEY (applicant_id) REFERENCES applicants(id)' +
  ')',
  applicant_filesDrop: 'DROP TABLE IF EXISTS applicant_files;',
  applicant_files: 'CREATE TABLE IF NOT EXISTS applicant_files (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'url VARCHAR(255),' +
  'type VARCHAR(20),' +
  'applicant_id INT,' +
  'FOREIGN KEY (applicant_id) REFERENCES applicants(id)' +
  ')',
  setNewApplicantFile: `INSERT INTO applicant_files SET ?`,
  newApplicantFile: {
    id: null,
    url: null,
    type: null,
    applicant_id: null,
  },
  skillsDrop: 'DROP TABLE IF EXISTS skills;',
  skills: 'CREATE TABLE IF NOT EXISTS skills (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'skill VARCHAR(255)' +
  ')',
  applicants_skillsDrop: 'DROP TABLE IF EXISTS applicants_skills;',
  applicants_skills: 'CREATE TABLE IF NOT EXISTS applicants_skills (' +
  'skill_id INT,' +
  'applicant_id INT,' +
  'FOREIGN KEY (skill_id) REFERENCES skills(id),' +
  'FOREIGN KEY (applicant_id) REFERENCES applicants(id)' +
  ')',
  applicants_job_postingsDrop: 'DROP TABLE IF EXISTS applicants_job_postings;',
  applicants_job_postings: 'CREATE TABLE IF NOT EXISTS applicants_job_postings (' +
  'applicant_id INT,' +
  'job_posting_id INT,' +
  'FOREIGN KEY (applicant_id) REFERENCES applicants(id),' +
  'FOREIGN KEY (job_posting_id) REFERENCES job_postings(id)' +
  ')',
  setMsgJoin: `INSERT INTO messages_join SET ?`,
  msgJoin: {
    id: null,
    sender_applicants_id: null,
    sender_employer_id: null,
    message_content_id: null,
    prev_message_id: null,
    recipient: null,
    mark_read: 0,
    send_date: null,
  },
  getMsgJoin: `SELECT * FROM messages_join WHERE ID=? ORDER BY send_date DESC`,
  getMsgJoinByRecipient: `SELECT * FROM messages_join WHERE recipient=? ORDER BY send_date DESC`,
  getMsgJoinByApplicantIDSender: `SELECT * FROM messages_join WHERE sender_applicants_id=? ORDER BY send_date DESC`,
  getMsgJoinBySenderIDSender: `SELECT * FROM messages_join WHERE sender_employer_id=? ORDER BY send_date DESC`,
  messages_joinDrop: 'DROP TABLE IF EXISTS messages_join;',
  messages_join: 'CREATE TABLE IF NOT EXISTS messages_join (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'sender_applicants_id INT,' +
  'sender_employer_id INT,' +
  'message_content_id INT,' +
  'prev_message_id INT,' +
  'recipient VARCHAR(255),' +
  'mark_read BOOL NOT NULL DEFAULT 0,' +
  'send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
  'FOREIGN KEY (sender_applicants_id) REFERENCES applicants(id),'+
  'FOREIGN KEY (sender_employer_id) REFERENCES employer(id),'+
  'FOREIGN KEY (message_content_id) REFERENCES messages_content(id)'+
  ')',
  setMsgContent: `INSERT INTO messages_content SET ?`,
  msgContent: {
    id: null,
    subject: null,
    message:null,
  },
  getMsgContent: `SELECT * FROM messages_content WHERE ID=?`,
  messages_contentDrop: 'DROP TABLE IF EXISTS messages_content;',
  messages_content: 'CREATE TABLE IF NOT EXISTS messages_content (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'subject VARCHAR(255),' +
  'message VARCHAR(2550)' +
  ')',
  alter_employer: 'ALTER TABLE employer ' +
  'ADD CONSTRAINT FK_job_postings_employer ' +
  'FOREIGN KEY (job_postings_id) REFERENCES employer(id)',  
  addDemoMessageContent1: `INSERT INTO messages_content VALUES (null, 'Welcome to Hack Reactor!', 'You will love it here.  Keep in Touch!');`,
  addDemoMessageContent2: `INSERT INTO messages_content VALUES (null, 'Acceptance Letter', 'Here is your formal acceptance letter');`,
  addDemoMessageContentReply: `INSERT INTO messages_content VALUES (null, 'acceptance', 'THANK YOU VERY MUCH!!!');`,
  addDemoResume: `INSERT INTO applicant_files (url, type, applicant_id) VALUES ("https://res.cloudinary.com/dse6qhxk5/image/upload/v1492897363/ilq6ifmqammkpzlwuxjs.jpg", "resume", 3);`,
  addDemoCoverLetter: `INSERT INTO applicant_files (url, type, applicant_id) VALUES ("https://res.cloudinary.com/dse6qhxk5/image/upload/v1492897363/ilq6ifmqammkpzlwuxjs.jpg", "coverletter", 3);`,

  // addDemoEmployerMessage: `INSERT INTO employer_messages (employer_id, message_join_id) VALUES `+
  // `((SELECT id FROM employer WHERE username='hackreactor'), (SELECT LAST_INSERT_ID()));`,
  // addDemoMessageResponseContent: `INSERT INTO messages_content VALUES (null, 'Thank you Hack Reactor!!!');`,

};




