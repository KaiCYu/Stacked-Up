import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import 'jquery-ui-bundle';
import Navbar from './Navbar';
import Main from './Main';
import Search from './Search';
import Login from './Login';
import MyProfile from './MyProfile';
import Profile from './Profile';
import EmployerProfile from './EmployerProfile';
import JobPost from './JobPost';
import SignupClient from './SignupClient';
import SignupEmployer from './SignupEmployer';
import PostingJob from './PostingJob';
import StreamVideo from './StreamVideo';
import ApplicantProfile from './ApplicantProfile';
import utils from './../../../lib/utility';
import PrivateRoute from './privateRoute';
import ApplicantsList from './ApplicantsList';
import CodePad from './CodePad';
import Messages from './Messages';

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
      messages: {
        receive: [],
        sent: [],
      },
      ws: null,
      userBeingCalled: '',
      updatedCode: '// code',
    };

    this.loginUrl = 'https://localhost:8000/login';
    this.sendLoginInfo = this.sendLoginInfo.bind(this);
    this.sendSearchInfo = this.sendSearchInfo.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.updateUsersLoginStatus = this.updateUsersLoginStatus.bind(this);
    window.handleReceiveCallWindow = this.handleReceiveCallWindow.bind(this);
    window.sendVideoCallRequest = this.sendVideoCallRequest.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.setMessagesToAppState = this.setMessagesToAppState.bind(this);
    this.searchAll = this.searchAll.bind(this);
    this.sendUpdatedCode = this.sendUpdatedCode.bind(this);
    this.redirectToCodePad = this.redirectToCodePad.bind(this);
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
      },
    });
  }

  componentDidUpdate() {
    if (this.state.incomingVideoCall) {
      this.state.incomingVideoCall = false;
      const requestor = this.state.incomingVideoCaller;
      const room = this.state.incomingVideoRoom;
      const receiveCallWindow = `<div id="receiveCallWindow"><p>Receive call from ${requestor}?</p></div>`;
      $('.currentPage').append(receiveCallWindow);
      const submitReceiveLink = `<button onclick="window.handleReceiveCallWindow('${requestor, room}')">Accept</button>`;
      $('#receiveCallWindow').append(submitReceiveLink);

      $(() => {
        $('#receiveCallWindow').dialog({
          position: {
            my: 'left top',
            at: 'right bottom',
          },
        });
      });
    }
  }

  handleReceiveCallWindow(requestor) {
    const receiveCallWindow = window.open();
    $(receiveCallWindow.document).ready(() => {
      receiveCallWindow.document.write('<div id="mainDiv"></div>');
      const mainDiv = $(receiveCallWindow.document).find('#mainDiv');
      mainDiv.append('<div id="msgBanner"></div>');
      mainDiv.append('<div id="videoElement"></div>');
      mainDiv.find('#msgBanner').append(`<p>Setting up Video Call request from ${requestor}</p>`);
      mainDiv.find('#videoElement').html(`<object style="height:450px;" data="https://live-video-server.herokuapp.com/?${requestor}"/>`)
    });
  }

  sendUpdatedCode(updatedCode) {
    const user = this.state.username;
    const userInCallWith = this.state.userBeingCalled || this.state.incomingVideoCaller;
    if (user && userInCallWith) {
      this.state.updatedCode = updatedCode;
      console.log('===>>>>>', this.state.updatedCode);
      this.state.ws.send(JSON.stringify({
        updatedCode,
        user,
        userInCallWith,
      }));
    }
  }

  sendVideoCallRequest(username) {
    const requestor = this.state.username;
    this.setState({ userBeingCalled: username });
    const callWindow = window.open();
    $(callWindow.document).ready(() => {
      callWindow.document.write('<div style="height:700px;" id="mainDiv"></div>');
      const mainDiv = $(callWindow.document).find('#mainDiv');
      mainDiv.append('<div id="msgBanner"></div>');
      mainDiv.append('<div id="videoElement"></div>');
      mainDiv.find('#msgBanner').append(`<p>Calling ${username}, Please hold...</p>`);
      const data = {
        called: username,
        requestor,
      };

      $.ajax({
        type: 'POST',
        url: '/requestCall',
        data,
        success: (room) => {
          $.ajax({
            type: 'GET',
            url: 'https://live-video-server.herokuapp.com',
            success: (results) => {
              mainDiv.find('#videoElement').html(`<object style="height:450px;" data="https://live-video-server.herokuapp.com/?${room}"/>`);
            },
            error: (error) => {
              console.log('error...error = ', error);
            },
          });
        },
        error: (error) => {
          console.log('error...error = ', error);
        },
      });
    });
  }


  updateUsersLoginStatus(loggedInUsers) {
    const newSearchApplicantsResults = this.state.searchResults.applicants
    .map((applicant) => {
      const newApplicant = applicant;
      if (applicant.username in loggedInUsers) {
        newApplicant.online = true;
        newApplicant.camlink = `<a href=# onclick="window.sendVideoCallRequest('${applicant.username}')">Call ${applicant.username}!</a>`
      } else {
        newApplicant.online = false;
        newApplicant.camlink = 'offline';
      }
      return newApplicant;
    });
    this.setState({
      searchResults: {
        applicants: newSearchApplicantsResults,
      },
    });
  }

  onInputChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  sendLoginInfo() {
    const userdata = {};
    userdata.username = this.state.username + '/' + this.state.logInOption;
    userdata.password = this.state.password;
    $.ajax({
      type: 'POST',
      url: '/login',
      data: userdata,
      success: (results) => {
        const HOST = location.origin.replace(/^http/, 'ws');
        const ws = new WebSocket(HOST + '/?username=' + results);
        this.setState({ ws });
        ws.onmessage = (msg) => {
          const message = JSON.parse(msg.data);
          if (message.type === 'loggedInUsersUpdate') {
            this.updateUsersLoginStatus(message.loggedInUsers);
          } else if (message.type === 'videoCallRequest') {
            this.setState({
              incomingVideoCall: true,
              incomingVideoCaller: message.requestor,
              incomingVideoRoom: message.room,
            });
          } else if (message.type === 'updatedCode') {
            this.setState({ updatedCode: msg.updatedCode });
          }
        };
        this.setState({
          isLoggedIn: true,
          currentUser: results,
        });
      },
      error: (error) => {
        console.log('error on sending login info, error =', error);
      },
    });
  }

  sendSearchInfo() {
    const context = this;
    const searchURL = '/search/' + this.state.searchUsername + '/10';
    $.ajax({
      type: 'GET',
      url: searchURL,
      success: (results) => {
        context.setState({ searchApplicantsResults: results });
      },
      error: (error) => {
        console.log('error on sending search info, error =', error);
      },
    });
  }

  setMessagesToAppState(messages) {
    this.setState({
      messages: {
        receive: messages.receive,
        sent: messages.sent,
      },
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

  redirectToCodePad() {
    $.ajax({
      url: '/redirectToCodePad',
      type: 'GET',
      success: (result) => {
        window.location = result.redirect;
      },
      error: (error) => {
        console.log(error);
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
              <PrivateRoute
                path="/messages"
                component={Messages}
                logInOption={this.state.logInOption}
                currentUser={this.state.currentUser}
                messagesReceive={this.state.messages.receive}
                messagesSent={this.state.messages.sent}
                setMessagesToAppState={this.setMessagesToAppState}
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
              <PrivateRoute
                path="/CodePad"
                component={CodePad}
                sendUpdatedCode={this.sendUpdatedCode}
                ws={this.state.ws}
                updatedCode={this.state.updatedCode}
              />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
