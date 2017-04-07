import React from 'react';

const PostingJob = (props) => (
  <div className="PostingJob-container">
    <h1>Post your job here</h1>
    <form action="/postingJob" method="POST">
      <span> Position: </span><input type="text" name="position" /><br />
      <span> Location: </span><input type="text" name="location" /><br />
      <span> State: </span><span> dropbox of states here</span><br />
      <span> Job type: </span><span> dropbox of job type here </span><br />
      <span> Starting Salary </span><input type="text" name="salary" /><br />
      <span> Job Description </span><br />
      <textarea placeholder="enter here" name="description" />
      <input type="submit" value="sign up" />
      <button>Cancel</button>
    </form>
  </div>
);

export default PostingJob;
