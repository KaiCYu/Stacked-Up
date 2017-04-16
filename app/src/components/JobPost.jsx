import React from 'react';
import $ from 'jquery';
import JobPostEntry from './JobPostEntry';
import { Table, TableBody, TableHeader, TableRow, TableHeaderColumn } from 'material-ui';

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
        console.log(data);
        console.log(this.props.info);
        if (this.props.info) {
          const list = Array.from(Object.keys(data));
          for (let i = 0; i < list.length; i += 1) {
            if (data[list[i]].company_name !== this.props.info.company_name) {
              delete data[list[i]];
            }
          }
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
    console.log(jobPostingId);
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
    console.log(this.state.postings);
    return (
      <div>
        <h1>JobPost</h1>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Company Name</TableHeaderColumn>
              <TableHeaderColumn>Position</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
              <TableHeaderColumn>Location</TableHeaderColumn>
              <TableHeaderColumn>Starting Salary</TableHeaderColumn>
              <TableHeaderColumn>Apply</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.postings.map(entry =>
              <JobPostEntry
                entry={entry}
                key={entry.id}
                handleApply={this.handleApply}
              />)
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default JobPost;
