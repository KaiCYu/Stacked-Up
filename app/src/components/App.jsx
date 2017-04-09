import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import Navbar from './Navbar.jsx';
import Main from './Main.jsx';
import Search from './Search.jsx';
import Login from './Login.jsx';
import MyProfile from './MyProfile.jsx';
import Profile from './Profile.jsx';
import EmployerProfile from './EmployerProfile.jsx';
import JobPost from './JobPost.jsx';
import SignupClient from './SignupClient.jsx';
import SignupEmployer from './SignupEmployer.jsx';
import PostingJob from './PostingJob';
import StreamVideo from './StreamVideo.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoggedIn: false,
      logInOption: '',
      myProfileInfo: {},
      employerProfileInfo: {},
      profileInfo: {},
      employerInfo: {},
      jobPostInfo: {},
    };
    this.getMyProfileInfo = this.getMyProfileInfo.bind(this);
    this.getEmployerProfileInfo = this.getEmployerProfileInfo.bind(this);
    this.getProfileInfo = this.getProfileInfo.bind(this);
    this.getEmployerInfo = this.getEmployerInfo.bind(this);
    this.getJobPostInfo = this.getJobPostInfo.bind(this);
    this.loginUrl = 'https://localhost:8000/login';
    this.sendLoginInfo = this.sendLoginInfo.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  onInputChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  sendLoginInfo() {
    console.log('login in App.jsx sendLoginInfo() = ', this.state.username, this.state.password, this.state.logInOption);
    const data = {};
    data.username = this.state.username + '/' + this.state.logInOption;
    data.password = this.state.password;
    $.ajax({
      type: 'POST',
      url: '/login',
      data: data,
      success: (results) => {
        console.log('sent login info, results =', results);
        var HOST = location.origin.replace(/^http/, 'ws');
        console.log('mounted, HOST = ', HOST);
        var ws = new WebSocket('ws://localhost:3000');
        ws.onmessage = function (msg) {
          msg = JSON.parse(msg.data);
          console.log(msg);
        };
        this.setState({ isLoggedIn: true });
      },
      error: (error) => {
        console.log('error on sending login info, error =', error)
      }
    });
  }

  getMyProfileInfo() {
    var context = this;
    $.ajax({
      type: 'GET',
      url: '/myprofileinfo',
      contentType: 'application/json',
      success: (results) => {
        console.log('got myprofile from server // profile = ', results)
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error)
      }
    });
  }

  getEmployerProfileInfo() {
    var context = this;
    $.ajax({
      type: 'GET',
      url: '/employerprofileinfo',
      contentType: 'application/json',
      success: (results) => {
        console.log('got employerprofileinfo from server // profile = ', results)
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error)
      }
    });
  }

  getProfileInfo() {
    var context = this;
    $.ajax({
      type: 'GET',
      url: '/profileinfo',
      contentType: 'application/json',
      success: (results) => {
        console.log('got profileinfo from server // profile = ', results)
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error)
      }
    });
  }

  getEmployerInfo() {
  var context = this;
    $.ajax({
      type: 'GET',
      url: '/employerinfo',
      contentType: 'application/json',
      success: (results) => {
        console.log('got employerinfo from server // profile = ', results)
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error)
      }
    });
  }

  getJobPostInfo() {
    var context = this;
    $.ajax({
      type: 'GET',
      url: '/jobpostinfo',
      contentType: 'application/json',
      success: (results) => {
        console.log('got jobpostinfo from server // profile = ', results)
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error)
      }
    });
  }

  handleOptionChange(changeEvent) {
    this.setState({
      logInOption: changeEvent.target.value
    });
  }

  handleLogOut() {
    $.ajax({
      url: '/logout',
      type: 'GET',
      success: (result) => {
        console.log(result);
        this.setState({ isLoggedIn: false });
      },
      error: (error) => {
        console.log('log out error occured', error);
      }
    });
  }

  render() {
    return (
      <div className="site">
        <Router>
          <div className="conditionals-container">
            <Navbar
              isLoggedIn={this.state.isLoggedIn}
              handleLogOut={this.handleLogOut}
            />
            <div className="currentPage">
              <Route
                path="/main"
                render={() => (
                  <Main/>
                )}
              />
              <Route
                path="/search"
                render={() => (
                  <Search/>
                )}
              />
              <Route
                path="/login"
                render={() => (
                  <Login
                    isLoggedin={this.isLoggedIn}
                    sendLoginInfo={this.sendLoginInfo}
                    onInputChange={this.onInputChange}
                    logInOption={this.state.logInOption}
                    handleOptionChange={this.handleOptionChange}
                  />
                )}
              />
              <Route
                path="/myProfile"
                getMyProfileInfo={this.state.getMyProfileInfo}
                render={() => (
                  <MyProfile/>
                )}
              />
              <Route
                path="/employerProfile"
                getEmployerProfileInfo={this.state.getEmployerProfileInfo}
                render={() => (
                  <EmployerProfile/>
                )}
              />

              <Route
                path="/profile"
                getProfileInfo={this.state.getProfileInfo}
                render={() => (
                  <Profile/>
                )}
              />
              <Route
                path="/jobPost"
                render={() => (
                  <JobPost/>
                )}
              />
              <Route
                path="/signupClient"
                render={() => (
                  <SignupClient/>
                )}
              />
              <Route
                path="/signupEmployer"
                render={() => (
                  <SignupEmployer/>
                )}
              />
              <Route
                path="/streamVideo"
                render={() => (
                  <StreamVideo/>
                )}
              />
              <Route
                path="/postingjob"
                render={() => (
                  <PostingJob />
                )}
              />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
