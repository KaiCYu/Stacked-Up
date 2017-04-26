import React from 'react';
import { TableRow, TableRowColumn, RaisedButton } from 'material-ui';
import { Link } from 'react-router-dom';
import JobPostEntryButton from './JobPostEntryButton';

const JobPostEntry = props => (
  <TableRow>
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
    { props.logInOption === 'company' ?
      <TableRowColumn>
        <Link
          to={{
            pathname: '/ApplicantsList',
            state: { jobInfo: props.entry },
          }}
        >
          <RaisedButton>See Applicants</RaisedButton>
        </Link>
      </TableRowColumn>
    :
      <TableRowColumn>
        <JobPostEntryButton
          handleApply={props.handleApply}
          id={props.entry.id}
          apply={props.entry.apply}
        />
      </TableRowColumn>
    }
  </TableRow>
);

export default JobPostEntry;
