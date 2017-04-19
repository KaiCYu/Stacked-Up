import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import 'jquery-ui-bundle';
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
import StreamVideo from './StreamVideo';
import ApplicantProfile from './ApplicantProfile';
import utils from './../../../lib/utility';
import PrivateRoute from './privateRoute';
import ApplicantsList from './ApplicantsList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoggedIn: false,
      isApplicant: true,
      logInOption: '',
      applicantInfo: {},
      profileInfo: {},
      employerInfo: {},
      jobPostInfo: {},
      myProfileInfo: {},
      // employerProfileInfo: {
      //   companyName: '',
      //   phoneNumber: '',
      //   email: '',
      //   city: '',
      //   state: '',
      //   country: '',
      // },
      loggedInUsers: {},
      searchApplicantsResults: [],
      searchUsername: '',
      incomingVideoCall: false,
      incomingVideoCaller: '',
      incomingVideoRoom: '',
      searchResults: {
        applicants: [],
        employers: [],
        jobPostings: [],
      },
    };

    this.getMyProfileInfo = this.getMyProfileInfo.bind(this);
    this.d = this.d.bind(this);
    this.getEmployerProfileInfo = this.getEmployerProfileInfo.bind(this);
    // this.getApplicantProfileInfo = this.getApplicantProfileInfo.bind(this);
    this.getProfileInfo = this.getProfileInfo.bind(this);
    this.getEmployerInfo = this.getEmployerInfo.bind(this);
    this.getJobPostInfo = this.getJobPostInfo.bind(this);
    this.loginUrl = 'https://localhost:8000/login';
    this.sendLoginInfo = this.sendLoginInfo.bind(this);
    this.sendSearchInfo = this.sendSearchInfo.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.updateUsersLoginStatus = this.updateUsersLoginStatus.bind(this);
    window.handleReceiveCallWindow = this.handleReceiveCallWindow.bind(this);
    this.receiveCall = this.receiveCall.bind(this);
    window.sendVideoCallRequest = this.sendVideoCallRequest.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    // this.applicantInputChange = this.applicantInputChange.bind(this);
    // this.signUpSubmit = this.signUpSubmit.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    // this.employerInputChange = this.employerInputChange.bind(this);
    // this.submitApplicant = this.submitApplicant.bind(this);
    // this.submitEmployer = this.submitEmployer.bind(this);
    this.searchAll = this.searchAll.bind(this);
    // this.submitEmployer = this.submitEmployer.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    window.checkState = this.checkState.bind(this);
    // this.previewFile = this.previewFile.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/verifyLogin',
      type: 'GET',
      success: (data) => {
        if (data === true) {
          this.setState({ isLoggedIn: true });
        } else {
          this.setState({ isLoggedIn: false });
        }
      },
      error: (error) => {
        console.log('user verified log in failed!: ', error);
      }
    });
  }

  componentDidUpdate() {
    if (this.state.incomingVideoCall) {
      console.log('setState detected and state.incomingVideoCall = ', this.state.incomingVideoCall)
      this.state.incomingVideoCall = false;
      var requestor = this.state.incomingVideoCaller;
      var room = this.state.incomingVideoRoom
      console.log('video call request receive launched, call from = ', requestor)
      var receiveCallWindow = `<div id="receiveCallWindow"><p>Receive call from ${requestor}?</p></div>`;
      $(".currentPage").append(receiveCallWindow);
      var submitReceiveLink = `<button onclick="window.handleReceiveCallWindow('${requestor, room}')">Accept</button>`;
      $("#receiveCallWindow").append(submitReceiveLink);

      $(function() {
        $( "#receiveCallWindow" ).dialog({
            position: {
                my: "left top",
                at: "right bottom"
            }
        });
      });
    }
  }

  handleReceiveCallWindow(requestor, room) {
    var receiveCallWindow = window.open();
    console.log('receiveCallWindow = ', receiveCallWindow);
    $(receiveCallWindow.document).ready(function() {
      receiveCallWindow.document.write("<div id=\"mainDiv\"></div>");
      var mainDiv = $(receiveCallWindow.document).find('#mainDiv');
      mainDiv.append("<div id=\"msgBanner\"></div>")
      mainDiv.append("<div id=\"videoElement\"></div>")
      mainDiv.find('#msgBanner').append(`<p>Setting up Video Call request from ${requestor}</p>`);
      mainDiv.find('#videoElement').html(`<object style="height:450px;" data="https://live-video-server.herokuapp.com/?${requestor}"/>`);
    });
  }

  receiveCall() {

  }

  sendVideoCallRequest(username) {
    var requestor = this.state.username
    var callWindow = window.open();
    $(callWindow.document).ready(function() {
      callWindow.document.write("<div style='height:700px;' id=\"mainDiv\"></div>");
      var mainDiv = $(callWindow.document).find('#mainDiv');
      mainDiv.append("<div id=\"msgBanner\"></div>")
      mainDiv.append("<div id=\"videoElement\"></div>")
      mainDiv.find('#msgBanner').append(`<p>Calling ${username}, Please hold...</p>`);
      // mainDiv.find('#msgBanner').load('https://live-video-server.herokuapp.com');
      var data = {
        called: username,
        requestor: requestor,
      }

      $.ajax({
        type: 'POST',
        url: '/requestCall',
        data: data,
        success: (room) => {
          console.log('Room for videochat will be ', room);

          $.ajax({
            type: 'GET',
            url: 'https://live-video-server.herokuapp.com',
            success: (results) => {
              mainDiv.find('#videoElement').html(`<object style="height:450px;" data="https://live-video-server.herokuapp.com/?${room}"/>`);
            },
            error: (error) => {
              console.log('error...error = ', error);
            }
          })

        },
        error: (error) => {
          console.log('error...error = ', error);
        }
      })
    });
    console.log('lets call', username);
  }


  updateUsersLoginStatus(loggedInUsers) {
    // const newSearchApplicantsResults = this.state.searchApplicantsResults
    const newSearchApplicantsResults = this.state.searchResults.applicants
    .map(function(applicant) {
      console.log('loggedInUsers updated, loggedInUsers = ', loggedInUsers)
      if (applicant.username in loggedInUsers) {
        applicant.online = true;
        applicant.camlink = `<a href=# onclick="window.sendVideoCallRequest('${applicant.username}')">Call ${applicant.username}!</a>`
      } else {
        applicant.online = false;
        applicant.camlink = 'offline';
      }
      return applicant;
    })
    console.log('newSearchApplicantsResults = ', newSearchApplicantsResults)
    this.setState({searchResults: {applicants: newSearchApplicantsResults}});
  }

  onInputChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  sendLoginInfo() {
    console.log('login in App.jsx sendLoginInfo() = ', this.state.username, this.state.password)
    const context = this;
    const userdata = {};
    userdata.username = this.state.username + '/' + this.state.logInOption;
    userdata.password = this.state.password;
    $.ajax({
      type: 'POST',
      url: '/login',
      data: userdata,
      success: (results) => {
        console.log('sent login info, results =', results)
        var HOST = location.origin.replace(/^http/, 'ws')
          console.log('mounted, HOST = ', HOST);
          var ws = new WebSocket(HOST+'/?username=' + results);
          ws.onmessage = function (msg) {
            msg = JSON.parse(msg.data);
            console.log(msg);
            if (msg.type === 'loggedInUsersUpdate') {
              context.updateUsersLoginStatus(msg.loggedInUsers);
            } else if (msg.type === 'videoCallRequest') {
              console.log('room = ', msg.room);
              console.log('msg = ', msg)
              context.setState({
                incomingVideoCall: true,
                incomingVideoCaller: msg.requestor,
                incomingVideoRoom: msg.room,
              });
            }
          };
        this.setState({
          isLoggedIn: true,
          currentUser: results
        });
        console.log('current user on app.jsx : ', this.state.currentUser);
      },
      error: (error) => {
        console.log('error on sending login info, error =', error);
      }
    });
  }

  checkState() {
    console.log(this.state);
  }

  sendSearchInfo() {
    console.log('searching for username = ', this.state.searchUsername)
    const context = this;
    const searchURL = '/search/' + this.state.searchUsername + '/10'
    $.ajax({
      type: 'GET',
      url: searchURL,
      success: (results) => {
        context.setState({ searchApplicantsResults: results });
      },
      error: (error) => {
        console.log('error on sending search info, error =', error)
      },
    });
  }

  d() {
    const context = this;
    $.ajax({
      type: 'GET',
      url: '/employerprofileinfo',
      contentType: 'application/json',
      success: (results) => {
        console.log('got employerprofileinfo from server // profile = ', results);
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error);
      },
    });
  }

  getMyProfileInfo() {
    const context = this;
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

  getProfileInfo() {
    const context = this;
    $.ajax({
      type: 'GET',
      url: '/profileinfo',
      success: (results) => {
        console.log('got profileinfo from server // profile = ', results)
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error)
      }
    });
  }

  getEmployerProfileInfo() {
    const context = this;
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

  getApplicantProfileInfo() {
    const context = this;
    $.ajax({
      type: 'GET',
      url: '/applicantrprofileinfo',
      contentType: 'application/json',
      success: (results) => {
        console.log('got applicantrprofileinfo from server // profile = ', results);
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error);
      },
    });
  }

  getEmployerInfo() {
    const context = this;
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
    const context = this;
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

  sendMessage() {
    $.ajax({
      type: 'POST',
      url: '/sendMessage',
      contentType: 'application/json',
      success: (results) => {
        console.log('sent message to the server // message = ', results)
      },
      error: (error) => {
        console.log('error on sending message to server // error', error)
      }
    });
  }

  handleOptionChange(changeEvent) {
    this.setState({ logInOption: changeEvent.target.value });
  }

  handleLogOut() {
    $.ajax({
      url: '/logout',
      type: 'GET',
      success: (result) => {
        this.setState({ isLoggedIn: false });
      },
      error: (error) => {
        console.log('log out error occured', error);
      }
    });
  }
  
  searchAll() {
    const searchURL = `/search/${this.state.searchUsername}/2/10`;
    $.ajax({
      type: 'GET',
      url: searchURL,
      success: (results) => {
        const filtered = utils.filterSearchResults(results);
        console.log('SUCCESSFUL SEARCH, results = ', filtered)
        this.setState({ searchResults: filtered });
      },
      error: (error) => {
        console.log('error on sending search info, error =', error);
      },
    });
  }

  render() {
    return (
      <div className="site">
        <Router>
          <div className="conditionals-container">
            <PrivateRoute
              component={Navbar}
              searchAll={this.searchAll}
              isLoggedIn={this.state.isLoggedIn}
              handleLogOut={this.handleLogOut}
              onInputChange={this.onInputChange}
            />
            <div className="currentPage">
              <Route
                path="/main"
                component={Main}
              />
              <Route
                path="/search"
                render={() => (
                  <Search
                    searchResults={this.state.searchResults}
                  />
                )}
              />
              <PrivateRoute
                path="/login"
                component={Login}
                isLoggedIn={this.state.isLoggedIn}
                logInOption={this.state.logInOption}
                handleOptionChange={this.handleOptionChange}
                sendLoginInfo={this.sendLoginInfo}
                onInputChange={this.onInputChange}
              />
              <PrivateRoute
                path="/myProfile"
                component={MyProfile}
                option={this.state.logInOption}
                currentUser={this.state.currentUser}
              />
              <Route
                path="/employerProfile"
                component={EmployerProfile}
              />
              <Route
                path="/applicantProfile"
                component={ApplicantProfile}
              />
              <Route
                path="/profile"
                getProfileInfo={this.state.getProfileInfo}
                component={Profile}
                sendMessage={this.sendMessage}
              />
              <PrivateRoute
                path="/jobPost"
                component={JobPost}
                logInOption={this.state.logInOption}
              />
              <Route
                path="/signupClient"
                component={SignupClient}
              />
              <Route
                path="/signupEmployer"
                component={SignupEmployer}
              />
              <Route
                path="/streamVideo"
                render={() => (
                  <StreamVideo />
                )}
              />
              <Route
                path="/postingjob"
                component={PostingJob}
              />
              <PrivateRoute
                path="/ApplicantsList"
                component={ApplicantsList}
                loggedInUsers={this.state.searchResults.applicants}
              />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
