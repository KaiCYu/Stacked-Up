import React from 'react';
import ProfilePicture from './ProfilePicture';
import { BrowserRouter as Link } from 'react-router-dom';

// import WorkHistoryEntry from './WorkHistoryEntry';

const ApplicantProfile = (props) => {
  return (
    <div className="search-container">
    {/*{console.log('props in applicant profile: ', props.info)}*/}
      <h1>Applicant Profile</h1>
      <div>
        <ProfilePicture src={props.info.profile_pic_url}/>
        <h3>Username: {props.info.username}</h3>
        <h4>Name: {`${props.info.firstName} ${props.info.lastName}`}</h4>
        <h5>Email: {props.info.email}</h5>
        <h5>Phone Number: {props.info.phone_number}</h5>
        <h5>Location: {`${props.info.city}, ${props.info.state} ${props.info.country}`}</h5>

        
        <a href={props.info.resume_url} target="_blank">Resume</a> <br />
        <a href={props.info.coverletter_url} target="_blank">Cover Letter</a>
        
        <FormInput title={'Upload another Resume'} id={"resume"} type={"file"} name={"resume"} onChange={this.previewFile} />
        
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
