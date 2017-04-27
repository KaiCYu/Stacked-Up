import React from 'react';
import { TableRow, TableRowColumn} from 'material-ui';

const TopApplicantsEntry = props => (
  <TableRow>
    <TableRowColumn className="top-applicants-column">
      {props.entry.username}
    </TableRowColumn>
    <TableRowColumn className="top-applicants-column">
      {props.entry.firstName}
    </TableRowColumn>
    <TableRowColumn className="top-applicants-column">
      {props.entry.lastName}
    </TableRowColumn>
    <TableRowColumn className="top-applicants-column">
      {props.entry.email}
    </TableRowColumn>
    <TableRowColumn className="top-applicants-column">
      {props.entry.state}
    </TableRowColumn>
  </TableRow>
);

export default TopApplicantsEntry;
