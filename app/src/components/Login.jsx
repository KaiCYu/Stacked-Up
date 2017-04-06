import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

const Login = (props) => (
  <div className='login-container'>
    <div>
  		<button>Sign In</button>
  	</div>
  	<div>
  		<Link
  			to='/signupClient'>
  		Sign up as a Client</Link>
  	</div>
	<div>
  		<Link
  			to='/signupEmployer'>
  		Sign up as an Employer</Link>
  	</div>
  </div>
);

export default Login;