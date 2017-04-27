import React from 'react';
import $ from 'jquery';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ProfilePicture from './ProfilePicture';
import JobPostEntryButton from './JobPostEntryButton';

class JobProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    };
    this.handleApply = this.handleApply.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen = () => {
    this.setState({ openDialog: true });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
    this.props.history.push('/JobPost');
  };

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
        this.handleOpen();

      },
      error: (error) => {
        console.log('error on apply! ', error);
      },
    });
  }

  render() {
    return (
      <div>
        <h1>Job Description</h1>
        <div>
          {console.log(this.props)}
          <ProfilePicture src={this.props.location.state.info.logo_url} />
          <h3>Company Name: {this.props.location.state.info.company_name}</h3>
          <h5>Location: {`${this.props.location.state.info.location}`}</h5>
          {/*<h5>Job Type: {`${this.props.location.state.info.type}`}</h5>*/}
          <h5>Starting Salary: {`${this.props.location.state.info.salary}`}</h5>
          <h5>Job Description: {`${this.props.location.state.info.description}`}</h5>
          <JobPostEntryButton
            handleApply={this.handleApply}
            id={this.props.location.state.id}
            apply={this.props.location.state.apply}
          />
        </div>
        <div>
          <Dialog
            actions={<FlatButton
              label="OK"
              primary
              onTouchTap={this.handleClose}
            />}
            modal={false}
            open={this.state.openDialog}
            onRequestClose={this.handleClose}
          >
            Application successfully submitted!
          </Dialog>
        </div>
      </div>
    );
  }

}

export default JobProfile;
