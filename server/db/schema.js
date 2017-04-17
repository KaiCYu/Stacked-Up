// create database queries
module.exports = {
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
  alter_employer: 'ALTER TABLE employer ' +
  'ADD CONSTRAINT FK_job_postings_employer ' +
  'FOREIGN KEY (job_postings_id) REFERENCES employer(id)',
  selectApplicants: 'Select * FROM APPLICANTS;',
  addDemoApplicant: `INSERT INTO APPLICANTS ( id, username, password, firstname, `+
  `lastname, email, phone_number, city, state, country ) VALUES (null, 'bobs', ` +
  `'123', 'Bobs', 'UpandDownInTheWater', 'bobs@gmail.com', 1234567, 'San Francisco', 'CA', ` +
  `'USA' );`,  
  showTables: `SELECT * FROM INFORMATION_SCHEMA.TABLES;`,
};
