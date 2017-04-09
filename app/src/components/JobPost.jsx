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
    const self = this;
    $.ajax({
      url: '/somewhere',
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        self.setState({ postings: data });
      },
      error: (error) => {
        console.log('AJAX request to get list of job postings failed due to ', error);
      },
    });
  }

  render() {
    return (
      <div className="JobPost-container">
        <h1>JobPost</h1>
        <div>
          {this.state.entries.map(entry => <JobPostEntry entry={entry} />)
          }
        </div>
      </div>
    );
  }
}

export default JobPost;
