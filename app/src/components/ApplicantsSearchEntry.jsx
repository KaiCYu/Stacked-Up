import React from 'react';
import { TableRow, TableRowColumn, RaisedButton } from 'material-ui';
import utils from '../../../lib/utility';

const ApplicantsSearchEntry = ({ applicant }) => (
  <TableRow>
    <TableRowColumn>{`${utils.capitalizeFirstLetter(applicant.firstName)} ${utils.capitalizeFirstLetter(applicant.lastName)}`}</TableRowColumn>
    <TableRowColumn>{applicant.email}</TableRowColumn>
    <TableRowColumn>{applicant.phone_number}</TableRowColumn>
    <TableRowColumn>{`${utils.capitalizeFirstLetter(applicant.firstName)} ${utils.capitalizeFirstLetter(applicant.lastName)}`}</TableRowColumn>
    <TableRowColumn>
      {applicant.online ? <RaisedButton onClick="window.sendVideoCallRequest">Call {applicant.username}!</RaisedButton> : 'Offline'}
    </TableRowColumn>
  </TableRow>
);


export default ApplicantsSearchEntry;
