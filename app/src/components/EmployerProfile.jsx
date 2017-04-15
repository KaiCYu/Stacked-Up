import React from 'react';
import JobPost from './JobPost';

const EmployerProfile = (props) => {

  return (
    <div className="search-container">
    {console.log('props in employer profile: ', props.info)}
      <h1>Employer Profile</h1>
      <div>
        <h3>{props.info.companyName}</h3>
        <h3>{props.info.email}</h3>
        <h3>{props.info.phoneNumber}</h3>
        <h2>{props.info.city}</h2>
        <h2>{props.info.state}</h2>
        <h2>{props.info.country}</h2>
        <br />

        <JobPost />

      </div>
    </div>
  );
};

export default EmployerProfile;
