import React from 'react';

const SignupClient = () => (
  <div className="SignupClient-container">
    <h1>SignupClient</h1>
    <form action="/signup" method="POST">
      <span> username: </span><input type="text" name="username" /><br />
      <span> password: </span><input type="text" name="password" /><br />
      <span> fullname: </span><input type="text" name="fullname" /><br />
      {/*<span> Address: </span><input type="text" /><br />
      <span> Phone Number: </span><input type="text" /><br />
      <span> upload your resume </span><br />
      <span> upload your cover letter </span><br />
      <span> upload your picture </span><br />*/}
      <input type="submit" value="sign up" />
      <button>Cancel</button>
    </form>
  </div>
);

export default SignupClient;
