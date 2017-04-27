import React from 'react';
import $ from 'jquery';
import { Table, TableBody, TableHeader, TableRow, TableHeaderColumn } from 'material-ui';
import JobPostEntry from './JobPostEntry';
import TopApplicantsEntry from './TopApplicantsEntry';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postings: [],
      topApplicants: [],
    };
    this.handleApply = this.handleApply.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/getTopJobPostings',
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        data = data.slice(0,8)
        this.setState({ postings: data });
      },
      error: (error) => {
        console.log('AJAX request to get list of job postings failed due to ', error);
      },
    });
    $.ajax({
      url: '/getTopApplicants',
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        data = data.slice(0,6)
        this.setState({ topApplicants: data });
      },
      error: (error) => {
        console.log('AJAX request to get list of job postings failed due to ', error);
      },
    });
  }

  handleApply(jobPostingId) {
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
      },
    });
  }

  render() {
    return (
      <div className="main-container">
        <div>
          <h2 id="hot-jobs-header" className="main-page-headers">Hot Jobs</h2>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow className="table-header">
                <TableHeaderColumn className="main-table-column-header">Company Name</TableHeaderColumn>
                <TableHeaderColumn className="main-table-column-header">Position</TableHeaderColumn>
                <TableHeaderColumn className="main-table-column-header">Description</TableHeaderColumn>
                <TableHeaderColumn className="main-table-column-header">Location</TableHeaderColumn>
                <TableHeaderColumn className="main-table-column-header">Starting Salary</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
              stripedRows={true}
              showRowHover={true}
            >
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

        <div>
          <h2 id="top-applicants-header" className="main-page-headers">Top Applicants</h2>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow className="table-header">
                <TableHeaderColumn className="main-table-column-header">Username</TableHeaderColumn>
                <TableHeaderColumn className="main-table-column-header">First Name</TableHeaderColumn>
                <TableHeaderColumn className="main-table-column-header">Last Name</TableHeaderColumn>
                <TableHeaderColumn className="main-table-column-header">Email</TableHeaderColumn>
                <TableHeaderColumn className="main-table-column-header">State</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.state.topApplicants.map(entry =>
                <TopApplicantsEntry
                  entry={entry}
                  key={entry.id}
                />)
              }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Main;
