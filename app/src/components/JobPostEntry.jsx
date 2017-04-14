import React from 'react';

const JobPostEntry = props => (
  <div className="JobPostEntry-container">
    <div>
      <div className="position">
        {props.entry.company_name}
      </div>
      <div className="position">
        {props.entry.position}
      </div>
      <div className="description">
        {props.entry.description}
      </div>
      <div className="location">
        {props.entry.location}
      </div>
      <div className="salary">
        {props.entry.salary}
      </div>
      <div>
        <button
          onClick={() => {
            props.handleApply(props.entry.id)
          }}
        >Apply
        </button>
      </div>
    </div>
  </div>
);

export default JobPostEntry;
