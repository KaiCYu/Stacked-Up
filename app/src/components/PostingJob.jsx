import React from 'react';
import $ from 'jquery';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/FlatButton';

// TODO: maybe need to refactor to use ajax call with state

class PostingJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: '',
      location: '',
      salary: '',
      description: '',
    };
    this.handleJobPosting = this.handleJobPosting.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  handleJobPosting() {
    const jobData = this.state;
    $.ajax({
      url: '/postingJob',
      type: 'POST',
      data: jobData,
      success: (data) => {
        this.props.history.push('/myProfile');
      },
      error: (err) => {
        console.log('job posting has failed!! ', err);
      }
    })
  }

  onInputChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  render() {
    return (
      <div style={style.block} >
        <p style={style.maintext} >Post your job here</p>
        <TextField
          hintText="Front-End Developer"
          name="position"
          onChange={this.onInputChange}
          floatingLabelText="Enter Job Position"
        /><br />
        <TextField
          hintText="San Francisco"
          name="location"
          onChange={this.onInputChange}
          floatingLabelText="Enter the city"
        /><br />
        <TextField
          hintText="California"
          name="state"
          onChange={this.onInputChange}
          floatingLabelText="Enter the State"
        /><br />
        <TextField
          hintText="Full-time"
          name="jobtype"
          onChange={this.onInputChange}
          floatingLabelText="Enter job type such as fulltime"
        /><br />
        <TextField
          hintText="145000"
          name="salary"
          onChange={this.onInputChange}
          floatingLabelText="Enter the starting salary"/><br />
        <TextField
          hintText="As a front-end developer...."
          name="description"
          onChange={this.onInputChange}
          floatingLabelText="Enter Job Description"
          multiLine
          fullWidth
        /><br />
        <RaisedButton onClick={this.handleJobPosting}>Post</RaisedButton>
      </div>
    );
  }
}

export default PostingJob;

const style = {
  block: { 'margin-left': '25px' },
  maintext: { fontFamily: 'Cochin', fontSize: 20 },
};
