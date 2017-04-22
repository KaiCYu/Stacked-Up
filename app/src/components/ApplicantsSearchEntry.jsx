import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import utils from '../../../lib/utility';

const ApplicantsSearchEntry = ({applicant}) => (
  <TableRow>
    <TableRowColumn>{applicant.username}</TableRowColumn>
    <TableRowColumn>{applicant.firstName+' '+applicant.lastName}</TableRowColumn>
    <TableRowColumn>{applicant.email}</TableRowColumn>
    <TableRowColumn>{applicant.phone_number}</TableRowColumn>
    <TableRowColumn>{applicant.city+', '+applicant.country}</TableRowColumn>
    <TableRowColumn>
      {applicant.online?
        <a href="#" onClick={`window.sendVideoCallRequest('${applicant.username}')`}>{`Call ${applicant.username}!`}</a>
        :"offline"}
    </TableRowColumn>
  </TableRow>
);


export default ApplicantsSearchEntry;
