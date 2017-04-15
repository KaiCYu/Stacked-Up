import React from 'react';
// import WorkHistoryEntry from './WorkHistoryEntry';

const ApplicantProfile = (props) => {
  return (
    <div className="search-container">
    {console.log('props in applicant profile: ', props.info)}
      <h1>Applicant Profile</h1>
      <div>
        <h3>{props.info.firstName + ' ' + props.info.lastName}</h3><br />
        <h4>{props.info.email}</h4><br />
        <h4>{props.info.phone_number}</h4><br />
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
