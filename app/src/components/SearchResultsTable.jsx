import React from 'react';
import { Table, TableBody } from 'material-ui';
import utils from './../../../lib/utility';
import ApplicantsSearchEntry from './ApplicantsSearchEntry';
import EmployersSearchEntry from './EmployersSearchEntry';
import JobPostsSearchEntry from './JobPostsSearchEntry';

const SearchResultsTable = ({ searchResults }) => (
  <div>
    <Table>
      <TableBody displayRowCheckbox={false}>
        <h3>Applicants</h3>
        {searchResults.applicants &&
          searchResults.applicants.map(applicant => (
            <ApplicantsSearchEntry key={applicant.id} applicant={applicant} />
          ))
        }
        <h3>Employers</h3>
        {searchResults.employers &&
          searchResults.employers.map(employer => (
            <EmployersSearchEntry key={employer.id} employer={employer} />
          ))
        }
        <h3>Job Postings</h3>
        {searchResults.jobPostings &&
          searchResults.jobPostings.map(jobPost => (
            <JobPostsSearchEntry key={jobPost.id} jobPost={jobPost} />
          ))
        }
      </TableBody>
    </Table>
  </div>
);

export default SearchResultsTable;
