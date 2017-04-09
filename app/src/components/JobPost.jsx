import React from 'react';
import $ from 'jquery';
import JobPostEntry from './JobPostEntry';


class JobPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postings: [],
    };
  }

  componentDidMount() {
    console.log('hello world!');
    $.ajax({
      url: '/getJobPostings',
      type: 'GET',
      success: (data) => {
        console.log('data received from /getJobPostings', data);
        this.setState({ postings: data });
      },
      error: (error) => {
        console.log('AJAX request to get list of job postings failed due to ', error);
      }
    });
  }

  // getJobPostings() {
  //   $.get({
  //     url: '/getJobPostings',
  //     success: (data) => {
  //       console.log('data received from /getJobPostings', data);
  //       this.setState({ postings: data });
  //     },
  //     error: (error) => {
  //       console.log('AJAX request to get list of job postings failed due to ', error);
  //     }
  //   });
  // }

  render() {
    return (
      <div className="JobPost-container">
        <h1>JobPost</h1>
        <div>
          {this.state.postings.map(entry => <JobPostEntry entry={entry} />)
          }
        </div>
      </div>
    );
  }
}

export default JobPost;
