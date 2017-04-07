// create database queries
module.exports = {
  applicants: 'CREATE TABLE IF NOT EXISTS applicants (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'username VARCHAR(255),' +
  'fullname VARCHAR(255),' +
  'password CHAR(255),' +
  'phone_number INT(20),' +
  'email VARCHAR(255),' +
  'resume_url VARCHAR(255),' +
  'photo_url VARCHAR(255),' +
  'UNIQUE INDEX(username)' +
  ')',
  employer: 'CREATE TABLE IF NOT EXISTS employer (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'name VARCHAR(255),' +
  'password VARCHAR(255),' +
  'phone_number INT,' +
  'email VARCHAR(255),' +
  'logo_url VARCHAR(255),' +
  'job_postings_id INT' +
  ')',
  job_postings: 'CREATE TABLE IF NOT EXISTS job_postings (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'position VARCHAR(255),' +
  'description VARCHAR(255),' +
  'location VARCHAR(255),' +
  'salary INT,' +
  'post_date DATE,' +
  'employer_id INT' +
  ')',
  skills: 'CREATE TABLE IF NOT EXISTS skills (' +
  'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  'skill VARCHAR(255)' +
  ')',
  applicants_skills: 'CREATE TABLE IF NOT EXISTS applicants_skills (' +
  'skill_id INT,' +
  'applicant_id INT,' +
  'FOREIGN KEY (skill_id) REFERENCES skills(id),' +
  'FOREIGN KEY (applicant_id) REFERENCES applicants(id)' +
  ')',
  applicants_job_postings: 'CREATE TABLE IF NOT EXISTS applicants_job_postings (' +
  'applicant_id INT,' +
  'job_posting_id INT,' +
  'FOREIGN KEY (applicant_id) REFERENCES applicants(id),' +
  'FOREIGN KEY (job_posting_id) REFERENCES job_postings(id)' +
  ')',
  alter_employer: 'ALTER TABLE employer ' +
  'ADD CONSTRAINT FK_job_postings_employer ' +
  'FOREIGN KEY (job_postings_id) REFERENCES employer(id)',
};
