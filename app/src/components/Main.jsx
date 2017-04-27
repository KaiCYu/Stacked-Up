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
		console.log(this.state.postings);
		console.log(this.props);
		return (

		<div className="main-container">		
			<div>
				<h3>Hot Jobs</h3>
				<Table>
				  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow className="table-header">
					  <TableHeaderColumn>Company Name</TableHeaderColumn>
					  <TableHeaderColumn>Position</TableHeaderColumn>
					  <TableHeaderColumn>Description</TableHeaderColumn>
					  <TableHeaderColumn>Location</TableHeaderColumn>
					  <TableHeaderColumn>Starting Salary</TableHeaderColumn>
					</TableRow>
				  </TableHeader>
				  <TableBody 
				  displayRowCheckbox={false}
					stripedRows={true}
					showRowHover={true}>
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
				<h3>Top Applicants</h3>
				<Table>
				  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow className="table-header">
					  <TableHeaderColumn>Username</TableHeaderColumn>
					  <TableHeaderColumn>First Name</TableHeaderColumn>
					  <TableHeaderColumn>Last Name</TableHeaderColumn>
					  <TableHeaderColumn>Email</TableHeaderColumn>
					  <TableHeaderColumn>State</TableHeaderColumn>
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
