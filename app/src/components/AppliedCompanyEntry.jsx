import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';

const AppliedCompanyEntry = props => (
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
  </TableRow>
);

export default AppliedCompanyEntry;
