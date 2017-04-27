import React from 'react';
import { TableRow, TableRowColumn} from 'material-ui';

const TopApplicantsEntry = props => (
  <TableRow>
    <TableRowColumn>
      {props.entry.username}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.firstName}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.lastName}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.email}
    </TableRowColumn>
    <TableRowColumn>
      {props.entry.state}
    </TableRowColumn>
  </TableRow>
);

export default TopApplicantsEntry;
