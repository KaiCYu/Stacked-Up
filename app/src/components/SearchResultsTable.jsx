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

  componentDidUpdate() {
    console.log('SearchResultsTable updated, this.props.searchResults.applicants = ', this.props.searchResults.applicants)
    var applicants = this.props.searchResults.applicants;
    if (applicants && applicants.length>0) {
      $('.table-applicants tbody').children().remove();
      applicants.forEach(applicant => {
      var camlink=applicant.online?
      `<a href=# onclick="window.sendVideoCallRequest('${applicant.username}')">Call ${applicant.username}!</a>`:'offline'
      $('.table-applicants tbody').append(
        '<tr>\
          <td>' + applicant.username + '</td>\
          <td>' + applicant.firstname + ' ' + applicant.lastname + '</td>\
          <td>' + applicant.email + '</td>\
          <td>' + applicant.phone_number + '</td>\
          <td>' + applicant.city + ', ' + applicant.country + '</td>\
          <td>' + camlink + '</td>\
        </tr>'
        )
      });
    }
  }

  render() {
    return (
    <div>
      <div>
        <h3>Applicants</h3>
        <table className="table table-applicants hidden">
          <thead>
            <tr>
              <th>Userame</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>City, Country</th>
              <th>Online Status</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
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
    </div>
    );
  }
}


export default SearchResultsTable;


