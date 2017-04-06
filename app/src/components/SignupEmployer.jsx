import React from 'react';

const SignupEmployer = (props) => (
  <div className="SignupEmployer-container">
    <h1>Sign up page for recruiter</h1>
    <div>
      <p> welcome! </p>
      <span> Company name: </span><input type="text" /><br />
      <span> Address: </span><input type="text" /><br />
      <span> Phone Number: </span><input type="text" /><br />
      <span> upload your corporate identity </span><br />
      <button>Sign up</button>
      <button>Cancel</button>
    </div>
  </div>
);

export default SignupEmployer;
