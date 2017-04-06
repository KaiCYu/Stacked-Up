CREATE DATABASE StackedUp;

USE StackedUp;

CREATE TABLE applicants (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  phone_number INT(20),
  email VARCHAR(255),
  resume_url VARCHAR(255), -- will be hosted on a cloud service
  photo_url VARCHAR(255), -- will be hosted on a cloud service
  UNIQUE INDEX(username)
);

CREATE TABLE job_postings (

);

CREATE TABLE employer (

);

CREATE TABLE skills (

);

CREATE TABLE applicants_skills (

);

CREATE TABLE applicants_job_postings (

);
