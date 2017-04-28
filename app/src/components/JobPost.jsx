import React from 'react';
import $ from 'jquery';
import { Table, TableBody, TableHeader, TableRow, TableHeaderColumn } from 'material-ui';
import JobPostEntry from './JobPostEntry';

class JobPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postings: [],
    };
  }

  componentDidMount() {
    $.ajax({
      url: '/getJobPostings',
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        if (this.props.info) {
          const list = Array.from(Object.keys(data));
          for (let i = 0; i < list.length; i += 1) {
            if (data[list[i]].company_name !== this.props.info.company_name) {
              delete data[list[i]];
            }
          }
        }
        this.setState({ postings: data });
      },
      error: (error) => {
        console.log('AJAX request to get list of job postings failed due to ', error);
      },
    });
  }

  render() {
    return (
      <div id="job-postings">
        <div id="job-postings-header-container">
          <h1 id="job-postings-main-header">Job Postings</h1>
          <h5>Find Your Next Job</h5>
        </div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn className="table-column">Company Name</TableHeaderColumn>
              <TableHeaderColumn className="table-column">Position</TableHeaderColumn>
              <TableHeaderColumn className="table-column">Description</TableHeaderColumn>
              <TableHeaderColumn className="table-column">Location</TableHeaderColumn>
              <TableHeaderColumn className="table-column">Starting Salary</TableHeaderColumn>
              { this.props.logInOption === 'applicant' ?
                <TableHeaderColumn>Detail</TableHeaderColumn>
              : this.props.info ?
                <TableHeaderColumn>Applicants</TableHeaderColumn>
                : null
              }
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {this.state.postings.map(entry =>
              <JobPostEntry
                entry={entry}
                key={entry.id}
                logInOption={this.props.logInOption}
                info={this.props.info}
              />)
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default JobPost;
