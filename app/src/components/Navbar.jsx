import React from 'react';

import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

const Navbar = (props) => (
<<<<<<< HEAD
  <header>
    <div className="navbar-component">
      <h5>StackedUp NAVBAR</h5>
      <nav className="links">
        <Link to="/main">Main Page</Link><br />
        <Link to="/search">Search</Link><br />
        {props.isLoggedIn ?
          <Link to="/logout">Logout</Link> :
          <Link to="/login">Log In</Link>}
        <br />
        <Link to="/myProfile">My Profile</Link><br />
        <Link to="/signupClient">Sign Up Client</Link>
      </nav>
    </div>
  </header>
=======
	<header>
		<div className="navbar-component">
			<h5>StackedUp NAVBAR</h5>
			<nav className="links">
				<Link to="/main">Main Page</Link><br />
				<Link to="/search">Search</Link><br />
				<Link to="/jobPost">Job posts</Link><br />
				{props.isLoggedIn ?
					<button onClick={props.handleLogOut}>Logout</button> :
					<Link to="/login">Log In</Link>}
				<br />
				<Link to="/myProfile">My Profile</Link><br />
				<Link to="/signupClient">Sign Up Client</Link><br />
			</nav>
		</div>
	</header>
>>>>>>> (feat) implements logout
);

export default Navbar;
