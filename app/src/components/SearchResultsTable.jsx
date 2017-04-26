import React from 'react';
import $ from 'jquery';
import { Table, TableBody } from 'material-ui';
import utils from './../../../lib/utility';
import ApplicantsSearchEntry from './ApplicantsSearchEntry';
import EmployersSearchEntry from './EmployersSearchEntry';
import JobPostsSearchEntry from './JobPostsSearchEntry';

class SearchResultsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Table>
          <TableBody
          displayRowCheckbox={false}>
            <h3>Applicants</h3>
            { this.props.searchResults.applicants &&
              this.props.searchResults.applicants.map(applicant => (
                <ApplicantsSearchEntry key={applicant.id} applicant={applicant} />
              ))
            }
            <h3>Employers</h3>
            { this.props.searchResults.employers &&
              this.props.searchResults.employers.map(employer => (
                <EmployersSearchEntry key={employer.id} employer={employer} />
              ))
            }
            <h3>Job Postings</h3>
            { this.props.searchResults.jobPostings &&
              this.props.searchResults.jobPostings.map(jobPost => (
                <JobPostsSearchEntry key={jobPost.id} jobPost={jobPost} />
              ))
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}


export default SearchResultsTable;


