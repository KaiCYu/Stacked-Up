import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

const SignupEmployer = (props) => (
  <div className="SignUpEmployer-container">
    {/*{console.log('props inside signup client: ', props)}*/}
    <h1>Sign up as an Employer</h1>

    <form action="/signupEmployer" method="POST">
      <label>Username:
        <input type="text" name="username" onChange={props.onInputChange} />
      </label>
      <label>Password:
        <input type="text" name="password" onChange={props.onInputChange} />
      </label>
      <br/>
      <label>Company Name:
        <input type="text" name="companyName" placeholder="Company Name" onChange={props.employerInputChange} />
      </label>
      <label>Email:
        <input type="text" name="email" placeholder="company@stackedup.com" onChange={props.employerInputChange} />
      </label>
      <label>Phone Number:
        <input type="text" name="phoneNumber" placeholder="(000)000-0000" onChange={props.employerInputChange} />
      </label>
      <br/>
      <label>City:
        <input type="text" name="city" placeholder="City" onChange={props.employerInputChange} />
      </label>
      <label>State:
        <input type="text" name="state" placeholder="State" onChange={props.employerInputChange} />
      </label>
      <label>Country:
        <input type="text" name="country" placeholder="Country" onChange={props.employerInputChange} />
      </label>
    </form>

    <Link to="/employerProfile" onClick={props.submitEmployer}>Submit</Link>

    <button>Cancel</button>
  </div>
);

export default SignupEmployer;

