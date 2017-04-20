import React from 'react';
import $ from 'jquery';

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
        console.log('after job posting data fetched: ', data);
        console.log('props log in : ', this.props);
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
      <div className="PostingJob-container">
        <h1>Post your job here</h1>
        <span> Position: </span><input type="text" name="position" onChange={this.onInputChange} /><br />
        <span> Location: </span><input type="text" name="location" onChange={this.onInputChange} /><br />
        <span> State: </span><input type="text" name="state" onChange={this.onInputChange} /><br />
        <span> Job type: </span><span> dropbox of job type here fulltime, parttime, contract, intern etc </span><br />
        <span> Starting Salary </span><input type="text" name="salary" onChange={this.onInputChange} /><br />
        <span> Job Description </span><br />
        <textarea rows="6" cols="60" placeholder="enter here" name="description" onChange={this.onInputChange} />
        <button onClick={this.handleJobPosting}>Post</button>
        <button>Cancel</button>
      </div>
    );
  }
}

export default PostingJob;
