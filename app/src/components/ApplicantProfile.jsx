import React from 'react';
import ProfilePicture from './ProfilePicture';
// import WorkHistoryEntry from './WorkHistoryEntry';

const ApplicantProfile = (props) => {
  return (
    <div className="search-container">
    {console.log('props in applicant profile: ', props.info)}
      <h1>Applicant Profile</h1>
      <div>
        <div>
          <img src={props.info.profile_pic_url}> </img>
        </div>

        <ProfilePicture src={props.info.profile_pic_url}/>
        <h3>Username: {props.info.username}</h3><br />
        <h4>Name: {`${props.info.firstName} ${props.info.lastName}`}</h4><br />
        <h5>Email: {props.info.email}</h5><br />
        <h5>Phone Number: {props.info.phone_number}</h5><br />
        <h5>Location: {`${props.info.city}, ${props.info.state} ${props.info.country}`}</h5><br />

        <div>Resume</div>
        <div>Cover Letter</div>
        
        {/*<div>Work History:
          {props.info.workHistory.map((workEntry, index) => {
            return <WorkHistoryEntry key={index} workEntry={workEntry} />;
          })}
        </div>*/}
      </div>
    </div>
  );
};

export default ApplicantProfile;
