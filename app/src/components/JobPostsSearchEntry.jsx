import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import utils from '../../../lib/utility';

const JobPostsSearchEntry = ({ jobPost }) => (
  <TableRow>
    <TableRowColumn>
      {utils.capitalizeFirstLetter(jobPost.position)}
    </TableRowColumn>
    <TableRowColumn>
      {jobPost.description.charAt(0).toUpperCase() + jobPost.description.slice(1)}
    </TableRowColumn>
    <TableRowColumn>
      {utils.capitalizeFirstLetter(jobPost.company_name)}
    </TableRowColumn>
    <TableRowColumn>
      {utils.capitalizeFirstLetter(jobPost.location)}
    </TableRowColumn>
    <TableRowColumn>
      {jobPost.salary}
    </TableRowColumn>
    <TableRowColumn>
      {jobPost.post_date.slice(0, 10)}
    </TableRowColumn>
    <TableRowColumn>
      {jobPost.online ? 'Online' : 'Offline'}
    </TableRowColumn>
  </TableRow>
);

export default JobPostsSearchEntry;
