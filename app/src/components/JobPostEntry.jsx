import React from 'react';
import { TableRow, TableRowColumn, FlatButton } from 'material-ui';
import { Link } from 'react-router-dom';
import JobPostEntryButton from './JobPostEntryButton';

const JobPostEntry = props => (
  <TableRow hoverable={true}>
    <TableRowColumn className="job-post-column">
      {props.entry.company_name}
    </TableRowColumn>
    <TableRowColumn className="job-post-column">
      {props.entry.position}
    </TableRowColumn>
    <TableRowColumn className="job-post-column">
      {props.entry.description}
    </TableRowColumn>
    <TableRowColumn className="job-post-column">
      {props.entry.location}
    </TableRowColumn>
    <TableRowColumn className="job-post-column">
      {props.entry.salary}
    </TableRowColumn>
    { props.logInOption === 'applicant' ?
      <TableRowColumn className="job-post-column">
        <JobPostEntryButton
          handleApply={props.handleApply}
          id={props.entry.id}
          apply={props.entry.apply}
        />
      </TableRowColumn>
      : props.info ?
        <TableRowColumn className="job-post-column">
          <Link
            to={{
              pathname: '/ApplicantsList',
              state: { jobInfo: props.entry },
            }}
          >
            <FlatButton label="See Applicants" primary />
          </Link>
        </TableRowColumn>
        : null
    }
  </TableRow>
);

export default JobPostEntry;
