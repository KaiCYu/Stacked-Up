import React from 'react';
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import TextField from 'material-ui/TextField';
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
      <div id="login-page">
        { this.props.isLoggedIn ?
          <Redirect to="/myProfile" />
        :
          <div className="login-container" >
            <h3>Join Today.</h3>
            <div id="login-title">
              Login or signup
            </div>
            <form ref="login" onSubmit={this.handleLoginSubmit}>
              <div className="inputbox">
                <TextField
                  type="text"
                  name="username"
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
              </div>
              <div className="radiobutton">
                <label className="radiobuttons">
                  <input
                    type="radio"
                    value="company"
                    checked={this.props.logInOption === 'company'}
                    onChange={this.props.handleOptionChange}
                  />
                  company
                </label>
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
              <FlatButton label="Log In" type="submit" primary fullWidth />
            </form>
            <Link to="/signupClient" className="signup-button">
              <FlatButton label="Sign up as a Client" primary fullWidth />
            </Link>
            <br />
            <Link to="/signupEmployer" className="signup-button">
              <FlatButton label="Sign up as an Employer" primary fullWidth />
            </Link>
          </div>
        }
      </div>
    );
  }
}

export default Login;
