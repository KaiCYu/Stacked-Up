import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

const SignupEmployer = (props) => (
  <div className="SignUpEmployer-container">
    {/*{console.log('props inside signup client: ', props)}*/}
    <h1>Sign up as an Employer</h1>
    <form action="/signupEmployer" method="POST">
      <label>Username*:
        <input type="text" name="username" />
      </label>
      <label>Password*:
        <input type="text" name="password" />
      </label>
      <br/>
      <label>Company Name*:
        <input type="text" name="companyName" />
      </label>
      <label>Email*:
        <input type="text" name="email" placeholder="company@stackedup.com" />
      </label>
      <label>Phone Number*:
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
      </label>
      <p>*Required</p>
    </form>

    <button>
      <Link to="/employerProfile" onClick={props.submitEmployer}>Submit</Link>
    </button>

    <button>Cancel</button>
  </div>
);

export default SignupEmployer;

