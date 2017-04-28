import React from 'react';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
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
      {console.log(jobPost)}
      <Link
        to={{
          pathname: '/JobProfile',
          state: {
            info: jobPost,
            id: jobPost.id,
          },
        }}
      >
        <FlatButton label="More details" primary />
      </Link>
    </TableRowColumn>
  </TableRow>
);

export default JobPostsSearchEntry;
