import React from 'react';

import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

const Navbar = ({isLoggedIn})=> (
	<header>
		<div className='navbar-component'>
			<h5>StackedUp NAVBAR</h5>
			<nav className='links'>
				<Link to="/main">Main Page</Link>
				<Link to="/search">Search</Link>
				{isLoggedIn ? null : <Link to="/login">Log In</Link>}
				{!isLoggedIn ? null : <Link to="/logout">Logout</Link>}
				<Link to="/myProfile">My Profile</Link>
			</nav>
		</div>
	</header>
);

export default Navbar;

