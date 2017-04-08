import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

class Login extends React.Component {


  constructor(props) {
    super(props);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    console.log('submitted')
    this.props.sendLoginInfo();
  }

  handleInputChange(event) {
    this.props.onInputChange(event)
  }

  render() {
    return (
        <div className="login-container" >
          <h1>Login</h1>


          <form ref='login'
                  onSubmit={this.handleLoginSubmit}>
                  <input
                    type='text'
                    name="username"
                    placeholder='ID'
                    onChange={this.handleInputChange}
                  />
                  <input
                    type='text'
                    name="password"
                    placeholder='password'
                    onChange={this.handleInputChange}
                  />
                  <button
                    type='submit'
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
    )
  }
}

export default Login;
