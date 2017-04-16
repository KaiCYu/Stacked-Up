import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import utils from '../../../lib/utility';

const ApplicantsSearchEntry = ({ applicant }) => {
  return (
    <TableRow>
      <TableRowColumn>
        {applicant.username}
      </TableRowColumn>
      <TableRowColumn>
        {utils.capitalizeFirstLetter(applicant.firstName) + ' ' + utils.capitalizeFirstLetter(applicant.lastName)}
      </TableRowColumn>
      <TableRowColumn>
        {applicant.email}
      </TableRowColumn>
      <TableRowColumn>
        {applicant.phone_number}
      </TableRowColumn>
      <TableRowColumn>
        {applicant.city + ', ' + applicant.country}
      </TableRowColumn>
      <TableRowColumn>
        {applicant.online ? 'Online' : 'Offline'}
      </TableRowColumn>
    </TableRow>
  );
};

export default ApplicantsSearchEntry;
