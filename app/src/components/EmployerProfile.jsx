import React from 'react';
import JobPost from './JobPost';
import ProfilePicture from './ProfilePicture';

const EmployerProfile = (props) => {
  return (
    <div className="search-container">
    {console.log('props in employer profile: ', props.info)}
      <h1>Employer Profile</h1>
      <div>
        <ProfilePicture src={props.info.logo_url}/>
        <h3>Company Name: {props.info.company_name}</h3>
        <h5>Email: {props.info.email}</h5>
        <h5>Phone Number: {props.info.phone_number}</h5>
        <h5>Location: {`${props.info.city}, ${props.info.state} ${props.info.country}`}</h5>
        <br />
        <JobPost info={props.info} />
      </div>
    </div>
  );
};

export default EmployerProfile;
