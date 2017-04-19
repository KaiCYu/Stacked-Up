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
    resume_url: null,
    coverletter_url: null,
  },
  getApplicantID: `Select id FROM applicants WHERE username=?;`,
  getApplicantName: `Select username FROM applicants WHERE id=?`,
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
  'resume_url VARCHAR(255),' +
  'coverletter_url VARCHAR(255),' +
  'UNIQUE INDEX(username)' +
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
  'FOREIGN KEY (employer_id) REFERENCES employer(id)'+
  ')',
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
  getMsgJoin: `SELECT * FROM messages_join WHERE ID=?`,
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
  messages_contentDrop: 'DROP TABLE IF EXISTS messages_content;',
  messages_content: 'CREATE TABLE IF NOT EXISTS messages_content (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'message VARCHAR(2550)' +
  ')',
  alter_employer: 'ALTER TABLE employer ' +
  'ADD CONSTRAINT FK_job_postings_employer ' +
  'FOREIGN KEY (job_postings_id) REFERENCES employer(id)',  
  addDemoMessageContent: `INSERT INTO messages_content VALUES (null, 'Welcome to Hack Reactor!');`,
  addDemoMessageContentReply: `INSERT INTO messages_content VALUES (null, 'THANK YOU VERY MUCH!!!');`,

  // addDemoEmployerMessage: `INSERT INTO employer_messages (employer_id, message_join_id) VALUES `+
  // `((SELECT id FROM employer WHERE username='hackreactor'), (SELECT LAST_INSERT_ID()));`,
  // addDemoMessageResponseContent: `INSERT INTO messages_content VALUES (null, 'Thank you Hack Reactor!!!');`,

};




