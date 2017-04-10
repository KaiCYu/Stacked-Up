import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

const SignupClient = (props) => (
  <div className="SignupClient-container">
    {/*{console.log('props inside signup client: ', props)}*/}
    <h1>Signup as a Client</h1>

    <form action="/signupApplicant" method="POST">
      <label>Username:
        <input type="text" name="username" placeholder="AwesomeEngineer" onChange={props.onInputChange} />
      </label>
      <label>Password:
        <input type="text" name="password" onChange={props.onInputChange} />
      </label>
      <br/>
      <label>First Name:
        <input type="text" name="firstName" placeholder="First Name" onChange={props.applicantInputChange} />
      </label>
      <label>Last Name:
        <input type="text" name="lastName" placeholder="Last Name" onChange={props.applicantInputChange} />
      </label>
      <br/>
      <label>Email:
        <input type="text" name="email" placeholder="janedoe@stackedup.com" onChange={props.applicantInputChange} />
      </label>
      <label>Phone Number:
        <input type="text" name="phoneNumber" placeholder="(000)000-0000" onChange={props.applicantInputChange} />
      </label>
      <br/>
      <label>City:
        <input type="text" name="city" placeholder="City" onChange={props.applicantInputChange} />
      </label>
      <label>State:
        <input type="text" name="state" placeholder="State" onChange={props.applicantInputChange} />
      </label>
      <label>Country:
        <input type="text" name="country" placeholder="Country" onChange={props.applicantInputChange} />
      </label>
    </form>

    <Link to="/applicantProfile" onClick={props.submitApplicant}>Submit</Link>

    <button>Cancel</button>
  </div>
);

export default SignupClient;

