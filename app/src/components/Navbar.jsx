import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

const Navbar = (props) => {
  const searchSubmit = (event) => {
    props.history.push('/search');
    event.preventDefault();
    document.getElementById('search').value = '';
    props.searchAll();
  };

  const logout = () => {
    props.handleLogOut();
    props.history.push('/main');
  };

  return (
    <Toolbar>
      <ToolbarGroup>
        <Link to="/main">
          <RaisedButton>StackedUp</RaisedButton>
        </Link>
      </ToolbarGroup>
      <ToolbarGroup>
        <Link to="/CodePad">
          <RaisedButton>CodePad</RaisedButton>
        </Link>
      </ToolbarGroup>
      <ToolbarGroup>
        <form
          onSubmit={(event) => {
            searchSubmit(event);
          }}
        >
          <TextField
            id="search"
            name="searchUsername"
            onChange={(event) => {
              props.onInputChange(event);
            }}
            placeholder="Search text here"
          />
          <RaisedButton>
            <Link
              id="search-button"
              to="/search"
              onClick={(event) => {
                searchSubmit(event);
              }}
            >Search
            </Link>
          </RaisedButton>
        </form>
      </ToolbarGroup>
      <ToolbarGroup>
        <Link to="/jobPost">
          <RaisedButton>Job Posts</RaisedButton>
        </Link>
      </ToolbarGroup>
      {props.isLoggedIn ?
        <ToolbarGroup>
          <Link to="/myProfile">
            <RaisedButton>My Profile</RaisedButton>
          </Link>
        </ToolbarGroup> :
          null
      }
      {props.isLoggedIn
      ?
      <ToolbarGroup>
        <Link to="/messages">
          <RaisedButton>Messages</RaisedButton>
        </Link>
      </ToolbarGroup>
      :
      <ToolbarGroup>
        <Link to="/login">
          <RaisedButton>Messages</RaisedButton>
        </Link>
      </ToolbarGroup>
      }
      <ToolbarGroup>
        {props.isLoggedIn ?
          <RaisedButton
            id="logout"
            onClick={logout}
          >Logout
          </RaisedButton> :
          <Link to="/login">
            <RaisedButton>Login</RaisedButton>
          </Link>}
      </ToolbarGroup>
    </Toolbar>
  );
};

export default Navbar;
