import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import utils from '../../../lib/utility';

const EmployersSearchEntry = ({ employer }) => (
  <TableRow>
    <TableRowColumn>
      {utils.capitalizeFirstLetter(employer.company_name)}
    </TableRowColumn>
    <TableRowColumn>
      {employer.phone_number}
    </TableRowColumn>
    <TableRowColumn>
      {employer.email}
    </TableRowColumn>
    <TableRowColumn>
      {utils.capitalizeFirstLetter(employer.city) + ', ' + utils.capitalizeFirstLetter(employer.state)}
    </TableRowColumn>
    <TableRowColumn>
      {employer.online ? 'Online' : 'Offline'}
    </TableRowColumn>
  </TableRow>
);

export default EmployersSearchEntry;
