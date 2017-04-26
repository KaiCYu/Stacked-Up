import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';

const ApplicantsListEntry = props => (
  <TableRow>
    <TableRowColumn>
      {props.entry.firstName + ' ' + props.entry.lastName}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.email}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.phone_number}
    </TableRowColumn>
    <TableRowColumn>
      <a href={props.entry.resume}>Resume</a>
    </TableRowColumn>
    <TableRowColumn>
      <a href={props.entry.coverletter}>Cover Letter</a>
    </TableRowColumn>
    <TableRowColumn>
      { props.check ?
        <a href="#" onClick={() => {
          window.sendVideoCallRequest(props.entry.username)}}>Call Now</a>
        : 'offline' }
    </TableRowColumn>
  </TableRow>
);

export default ApplicantsListEntry;
