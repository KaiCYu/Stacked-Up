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
    this.handleApply = this.handleApply.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/getJobPostings',
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        // console.log(data);
        // console.log(this.props.info);
        if (this.props.info) {
          const list = Array.from(Object.keys(data));
          for (let i = 0; i < list.length; i += 1) {
            if (data[list[i]].company_name !== this.props.info.company_name) {
              delete data[list[i]];
            }
          }
          console.log('here is the data', data);
          console.log('here is the data', typeof data);
          this.setState({ postings: data });
        } else {
          this.setState({ postings: data });
        }
      },
      error: (error) => {
        console.log('AJAX request to get list of job postings failed due to ', error);
      },
    });
  }

  handleApply(jobPostingId) {
    // console.log(jobPostingId);
    const applyingData = {};
    applyingData.jobPostingId = jobPostingId;
    $.ajax({
      url: '/apply',
      type: 'POST',
      data: applyingData,
      success: (data) => {
        console.log('application successfully submitted!');
        // TODO: change the button to applied after MVP
      },
      error: (error) => {
        console.log('error on apply! ', error);
      }
    });
  }

  render() {
    return (
      <div id="job-postings">
        <div id="job-postings-header-container">
          <h1>Job Postings</h1>
          <h5>Find Your Next Job</h5>
        </div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Company Name</TableHeaderColumn>
              <TableHeaderColumn>Position</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
              <TableHeaderColumn>Location</TableHeaderColumn>
              <TableHeaderColumn>Starting Salary</TableHeaderColumn>
              { this.props.logInOption === 'company' ?
                <TableHeaderColumn>Applicants</TableHeaderColumn>
                :
                <TableHeaderColumn>Apply</TableHeaderColumn>
              }
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.postings.map(entry =>
              <JobPostEntry
                entry={entry}
                key={entry.id}
                handleApply={this.handleApply}
                logInOption={this.props.logInOption}
              />)
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default JobPost;
