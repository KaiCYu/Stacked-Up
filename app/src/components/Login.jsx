import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

const Login = (props) => (
  <div className="login-container">
    <h1>Login</h1>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="ID" />
      <input type="password" name="password" placeholder="password" />
      <input type="submit" value="Log In" />
    </form>
    <div>
      <Link to="/signupClient">
        Sign up as a Client</Link>
    </div>
    <div>
      <Link to="/signupEmployer">
      Sign up as an Employer</Link>
    </div>
  </div>
);

export default Login;
