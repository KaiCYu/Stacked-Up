import React from 'react';

import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => (
  <header>
    <div className="navbar-component">
      <h5>StackedUp NAVBAR</h5>
      <nav className="links">
        <Link to="/main">Main Page</Link><br />
        <Link to="/search">Search</Link><br />
        {isLoggedIn ?
          <Link to="/logout">Logout</Link> :
          <Link to="/login">Log In</Link>}
        <br />
        <Link to="/myProfile">My Profile</Link><br />
        <Link to="/signupClient">Sign Up Client</Link>
      </nav>
    </div>
  </header>
);

export default Navbar;
