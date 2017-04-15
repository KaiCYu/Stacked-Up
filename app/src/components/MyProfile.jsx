import React from 'react';
import { Link } from 'react-router-dom';
import EmployerProfile from './EmployerProfile';
import ApplicantProfile from './ApplicantProfile';

const MyProfile = (props) => (
  <div className="search-container">
    {console.log('props in myprofile: ', props)}
    <div>
      {props.option === 'company' ? 
      <EmployerProfile info={props.employerInfo} /> : 
      <ApplicantProfile info={props.applicantInfo} />}
    </div>

    {props.option === 'company' ? <Link to="/postingjob">Post job</Link> : null}
  </div>
);

export default MyProfile;
