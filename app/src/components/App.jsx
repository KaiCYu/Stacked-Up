import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Main from './Main.jsx';
import Search from './Search.jsx'
import Login from './Login.jsx';
import MyProfile from './MyProfile.jsx';
import Profile from './Profile.jsx';
import EmployerProfile from './EmployerProfile.jsx';
import JobPost from './JobPost.jsx';
import SignupClient from './SignupClient.jsx'
import SignupEmployer from './SignupEmployer.jsx'
import StreamVideo from './StreamVideo.jsx'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: false,
			myProfileInfo: {},
			employerProfileInfo: {},
			profileInfo: {},
			employerInfo: {},
			jobPostInfo: {},
		};
		this.getMyProfileInfo.bind(this);
		this.getEmployerProfileInfo.bind(this);
		this.getProfileInfo.bind(this);
		this.getEmployerInfo.bind(this);
		this.getJobPostInfo.bind(this);
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
	render() {
		return (
			<div className='site'>
				<Router>
					<div className='conditionals-container'>
						<Navbar 
						isLoggedIn={this.state.isLoggedIn}
						/>
						<div className='currentPage'>
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
								isLoggedin={this.state.isLoggedIn} 
								render={() => (
									<Login/>
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
								getjobPostInfo={this.state.getJobPostInfo}
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
						</div>
					</div>
				</Router>
			</div>
		)
	}
}



export default App;

