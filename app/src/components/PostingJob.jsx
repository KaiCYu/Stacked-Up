import React from 'react';

const PostingJob = (props) => (
  <div className="PostingJob-container">
    <h1>Post your job here</h1>
    <div>
      <span> Title: </span><input type="text" /><br />
      <span> Location: </span><input type="text" />
      <span> Job type: </span><span> dropbox of job type here </span><br />
      <span> State: </span><span> dropbox of states here</span><br />
      <span> Starting Salary </span><input type="text" /><br />
    </div>
    <div>
      <span> Job Description </span><br />
      <textarea placeholder="enter here" />
    </div>
    <button>Sign up</button>
    <button>Cancel</button>
  </div>
);

export default PostingJob;
