import React from 'react';
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

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
              <TextField
                type="text"
                name="username"
                id="inputID"
                placeholder="Username"
                onChange={this.handleInputChange}
              />
              <br />
              <TextField
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.handleInputChange}
              />
              <br />
              <RaisedButton
                primary="true"
                type="submit"
              >Log In</RaisedButton>
            </form>
            <FlatButton primary="true">
              <Link
                to="/signupClient"
                className="signup-button"
              >Sign up as a Client
              </Link>
            </FlatButton>
            <br />
            <FlatButton primary="true">
              <Link to="/signupEmployer" className="signup-button">Sign up as an Employer</Link>
            </FlatButton>
          </div>
        }
      </div>
    );
  }
}

export default Login;
