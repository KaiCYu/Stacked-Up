import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/FlatButton';

import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';


const Navbar = (props) => {
  return (
    <header>
      <div className="navbar-component">
        <h5>StackedUp NAVBAR</h5>
        <nav className="links">
          <Link to="/main">Main Page</Link><br />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById('search').value = '';
              props.searchAll();
            }}
          >
            <TextField
              id="search"
              name="searchUsername"
              onChange={(event) => {
                props.onInputChange(event);
              }}
            />
            <RaisedButton
              id="search-button"
            >Search
            </RaisedButton>
          </form>
          <Link to="/search">Search</Link><br />
          {props.isLoggedIn ?
            <button onClick={props.handleLogOut}>Logout</button> :
            <Link to="/login">Log In</Link>}
          <br />
          <Link to="/myProfile">My Profile</Link><br />
          <Link to="/signupClient">Sign Up Client</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
