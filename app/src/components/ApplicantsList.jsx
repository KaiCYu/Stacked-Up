import React from 'react';
import $ from 'jquery';
import { Table, TableBody, TableHeader, TableRow, TableRowColumn, TableHeaderColumn } from 'material-ui';
import ApplicantsListEntry from './ApplicantsListEntry';

class ApplicantsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicants: [],
      loggedInUser: [],
    };
  }

  componentWillMount() {
    $.ajax({
      url: '/getApplicants',
      type: 'GET',
      data: { jobPosting_id: this.props.location.state.jobInfo.id },
      success: (results) => {
        const user = results[0].users;
        delete results[0].users;
        this.setState({
          applicants: results,
          loggedInUser: user,
        });
      },
      error: (error) => {
        console.log(error, '<===== failed to get applicants');
      },
    });
  }

  render() {
    return (
      <div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Position</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
              <TableHeaderColumn>Location</TableHeaderColumn>
              <TableHeaderColumn>Starting Salary</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                {this.props.location.state.jobInfo.position}
              </TableRowColumn>
              <TableRowColumn>
                {this.props.location.state.jobInfo.description}
              </TableRowColumn>
              <TableRowColumn>
                {this.props.location.state.jobInfo.location}
              </TableRowColumn>
              <TableRowColumn>
                {this.props.location.state.jobInfo.salary}
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
        <div>
          <h1> Applicants Lists </h1>
        </div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Full Name</TableHeaderColumn>
              <TableHeaderColumn>Email</TableHeaderColumn>
              <TableHeaderColumn>Phone Number</TableHeaderColumn>
              <TableHeaderColumn>Resume</TableHeaderColumn>
              <TableHeaderColumn>Cover Letter</TableHeaderColumn>
              <TableHeaderColumn>Log In Status</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.applicants.map((entry) => {
              let check = false;
              for (let i = 0; i < this.state.loggedInUser.length; i += 1) {
                if (this.state.loggedInUser[i] === entry.username) {
                  check = true;
                }
              }
              return (
                <ApplicantsListEntry
                  entry={entry}
                  key={entry.id}
                  check={check}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default ApplicantsList;
