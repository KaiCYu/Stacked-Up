import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';

const AppliedCompanyEntry = props => (
  <TableRow>
    <TableRowColumn>
      {props.entry.companyName}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.position}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.Description}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.location}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.salary}
    </TableRowColumn>
  </TableRow>
);

export default AppliedCompanyEntry;
