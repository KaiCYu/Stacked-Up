import React from 'react';
import { TableRow, TableRowColumn, FlatButton } from 'material-ui';
import { Link } from 'react-router-dom';

const JobPostEntry = props => (
  <TableRow hoverable={true}>
    <TableRowColumn style={style.align}>
      {props.entry.company_name}
    </TableRowColumn>
    <TableRowColumn style={style.align}>
      {props.entry.position}
    </TableRowColumn>
    <TableRowColumn style={style.align}>
      {props.entry.description}
    </TableRowColumn>
    <TableRowColumn style={style.align}>
      {props.entry.location}
    </TableRowColumn>
    <TableRowColumn style={style.align}>
      {props.entry.salary}
    </TableRowColumn>
    { props.logInOption === 'applicant' ?
      <TableRowColumn style={style.align}>
        <Link
          to={{
            pathname: '/JobProfile',
            state: {
              info: props.entry,
              id: props.entry.id,
              apply: props.entry.apply,
            },
          }}
        >
          <FlatButton label="More details" primary />
        </Link>
      </TableRowColumn>
      : props.info ?
        <TableRowColumn style={style.align}>
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

const style = {
  align: { 'text-align': 'center' },
};
