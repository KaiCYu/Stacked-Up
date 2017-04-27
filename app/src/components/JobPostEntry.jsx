import React from 'react';
import { TableRow, TableRowColumn, FlatButton } from 'material-ui';
import { Link } from 'react-router-dom';
import JobPostEntryButton from './JobPostEntryButton';

const JobPostEntry = props => (
  <TableRow hoverable={true}>
    <TableRowColumn>
      {props.entry.company_name}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.position}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.description}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.location}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.salary}
    </TableRowColumn>
    { props.logInOption === 'applicant' ?
      <TableRowColumn>
        <JobPostEntryButton
          handleApply={props.handleApply}
          id={props.entry.id}
          apply={props.entry.apply}
        />
      </TableRowColumn>
      : props.info ?
        <TableRowColumn>
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
