import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Main from './Main.jsx';
import Search from './Search.jsx'
import Login from './Login.jsx';
import Profile from './Profile.jsx';



class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return (
			<div className='site'>
				<Router>
					<div className='conditionals-container'>
						<Navbar />
						<div className='currentPage'>
							<Route 
								path="/main" render={() => (
									<Main/>
								)}
							/>
							<Route 
								path="/search" render={() => (
									<Search/>
								)}
							/>
							<Route 
								path="/login" render={() => (
									<Login/>
								)}
							/>
							<Route 
								path="/profile" render={() => (
									<Profile/>
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

