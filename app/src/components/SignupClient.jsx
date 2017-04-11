import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

const SignupClient = (props) => (
  <div className="SignupClient-container">
    {/*{console.log('props inside signup client: ', props)}*/}
    <h1>Signup as a Client</h1>
    <form action="/signupApplicant" method="POST" encType="multipart/form-data">
      <label>Username:
        <input type="text" name="username" placeholder="AwesomeEngineer" />
      </label>
      <label>Password:
        <input type="text" name="password" />
      </label>
      <br/>
      <label>First Name:
        <input type="text" name="firstName" placeholder="First Name" />
      </label>
      <label>Last Name:
        <input type="text" name="lastName" placeholder="Last Name" />
      </label>
      <br/>
      <label>Email:
        <input type="text" name="email" placeholder="janedoe@stackedup.com" />
      </label>
      <label>Phone Number:
        <input type="text" name="phoneNumber" placeholder="(000)000-0000" />
      </label>
      <br/>
      <label>City:
        <input type="text" name="city" placeholder="City" />
      </label>
      <label>State:
        <input type="text" name="state" placeholder="State" />
      </label>
      <label>Country:
        <input type="text" name="country" placeholder="Country" />
      </label><br />
      <span> upload your resume </span><input type="file" name="resume" /><br />
      <span> upload your cover letter </span><input type="file" name="coverletter" /><br />
      <span> upload your photo </span><input type="file" name="photo" /><br />
      <input type="submit" value="sign up" />
      <button>Cancel</button>
    </form>
    {/*
      if we need ajax post call on applicant sign up
      <Link to="/applicantProfile" onClick={props.submitApplicant}>Submit</Link>
    */}
  </div>
);

export default SignupClient;

