import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHeaderColumn, TableBody } from 'material-ui';
import $ from 'jquery';
import ProfilePicture from './ProfilePicture';
import AppliedCompanyEntry from './AppliedCompanyEntry';
import FormInput from './FormInput';

// import WorkHistoryEntry from './WorkHistoryEntry';

class ApplicantProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    $.ajax({
      url: '/getAppliedCompanies',
      type: 'GET',
      success: (result) => {
        console.log(result);
        this.setState({
          list: result,
        });
      },
      error: (error) => {
        console.log('this is the error', error);
      },
    });
  }

  render() {
    return (
      <div className="search-container">
      {/*{console.log('props in applicant profile: ', props.info)}*/}
        <h1>Applicant Profile</h1>
        <div>
          <ProfilePicture src={this.props.info.profile_pic_url}/>
          <h3>Username: {this.props.info.username}</h3>
          <h4>Name: {`${this.props.info.firstName} ${this.props.info.lastName}`}</h4>
          <h5>Email: {this.props.info.email}</h5>
          <h5>Phone Number: {this.props.info.phone_number}</h5>
          <h5>Location: {`${this.props.info.city}, ${this.props.info.state} ${this.props.info.country}`}</h5>

          
          <a href={this.props.info.resume_url} target="_blank">Resume</a> <br />
          <a href={this.props.info.coverletter_url} target="_blank">Cover Letter</a>
          
          {/*<FormInput title={'Upload another Resume'} id={"resume"} type={"file"} name={"resume"} onChange={this.previewFile} />*/}
          
          {/*<div>Work History:
            {props.info.workHistory.map((workEntry, index) => {
              return <WorkHistoryEntry key={index} workEntry={workEntry} />;
            })}
          </div>*/}

          <h1>List of Applied Companies</h1>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Company Name</TableHeaderColumn>
                <TableHeaderColumn>Position</TableHeaderColumn>
                <TableHeaderColumn>Description</TableHeaderColumn>
                <TableHeaderColumn>Location</TableHeaderColumn>
                <TableHeaderColumn>Starting Salary</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.state.list.map(entry =>
                <AppliedCompanyEntry
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

export default ApplicantProfile;
