import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';


const Navbar = ()=> (
	<header>
		<div className='navbar-component'>
			<h5>StackedUp NAVBAR</h5>
			<nav className='links'>
				<Link to="/main">Main Page</Link>
				<Link to="/search">Search</Link>
				<Link to="/login">Log In</Link>
				<Link to="/profile">My Profile</Link>
			</nav>
		</div>
	</header>
)

export default Navbar;