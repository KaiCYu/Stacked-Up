DROP DATABASE IF EXISTS stackedup;

CREATE DATABASE stackedup;

USE stackedup;

CREATE TABLE applicants(
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255),
  fullname VARCHAR(255),
  password CHAR(255), -- TODO: change length to hash length later
  phone_number INT(20),
  email VARCHAR(255),
  resume_url VARCHAR(255), -- will be hosted on a cloud service
  photo_url VARCHAR(255), -- will be hosted on a cloud service
  UNIQUE INDEX(username)
);

CREATE TABLE employer(
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  password VARCHAR(255),
  phone_number INT,
  email VARCHAR(255),
  logo_url VARCHAR(255), -- will be hosted on a cloud service
  job_postings_id INT
  -- FOREIGN KEY (job_postings_id) REFERENCES job_postings(id)
);

CREATE TABLE job_postings(
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  position VARCHAR(255),
  description VARCHAR(255),
  location VARCHAR(255),
  salary INT,
  post_date DATE,
  employer_id INT,
  FOREIGN KEY (employer_id) REFERENCES employer(id)
);

CREATE TABLE skills(
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  skill VARCHAR(255)
);

CREATE TABLE applicants_skills(
  skill_id INT,
  applicant_id INT,
  FOREIGN KEY (skill_id) REFERENCES skills(id),
  FOREIGN KEY (applicant_id) REFERENCES applicants(id)
);

CREATE TABLE applicants_job_postings(
  applicant_id INT,
  job_posting_id INT,
  FOREIGN KEY (applicant_id) REFERENCES applicants(id),
  FOREIGN KEY (job_posting_id) REFERENCES job_postings(id)
);

-- Alter employer table to have a foreign key that references job_postings table.
-- Required because employer won't be able to reference a table that hasn't been created yet.
-- Problem exists because of the order these tables must be created.
ALTER TABLE employer
  ADD CONSTRAINT FK_job_postings_employer FOREIGN KEY (job_postings_id) REFERENCES employer(id)

