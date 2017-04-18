import React from 'react';
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    this.props.sendLoginInfo();
    $('form').trigger('reset');
    $('form').find('input#inputID').focus();
  }

  handleInputChange(event) {
    this.props.onInputChange(event);
  }

  render() {
    return (
      <div>
        { this.props.isLoggedIn ?
          <Redirect to="/myProfile" />
        :
          <div className="login-container" >
            <h1>Login</h1>
            <form ref="login" onSubmit={this.handleLoginSubmit}>
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value="company"
                    checked={this.props.logInOption === 'company'}
                    onChange={this.props.handleOptionChange}
                  />
                  company
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value="applicant"
                    checked={this.props.logInOption === 'applicant'}
                    onChange={this.props.handleOptionChange}
                  />
                  applicant
                </label>
              </div>
              <input
                type="text"
                name="username"
                id="inputID"
                placeholder="ID"
                onChange={this.handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                onChange={this.handleInputChange}
              />
              <button
                type="submit"
              >Log In</button>
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
        }
      </div>
    );
  }
}

export default Login;
