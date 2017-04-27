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
    <Toolbar
      style={{
        backgroundColor: 'rgb(0, 188, 212)',
      }}
    >
      <ToolbarGroup>
        <Link to="/main">
          <RaisedButton><span className="navbar-text">StackedUp</span></RaisedButton>
        </Link>
      </ToolbarGroup>
      <ToolbarGroup>
        <Link to="/CodePad">
          <RaisedButton><span className="navbar-text">CodePad</span></RaisedButton>
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
            ><span className="navbar-text">Search</span>
            </Link>
          </RaisedButton>
        </form>
      </ToolbarGroup>
      <ToolbarGroup>
        <Link to="/jobPost">
          <RaisedButton><span className="navbar-text">Job Postings</span></RaisedButton>
        </Link>
      </ToolbarGroup>
      {props.isLoggedIn ?
        <ToolbarGroup>
          <Link to="/myProfile">
            <RaisedButton><span className="navbar-text">My Profile</span></RaisedButton>
          </Link>
        </ToolbarGroup> :
          null
      }
      {props.isLoggedIn &&
        <ToolbarGroup>
          <Link to="/messages">
            <RaisedButton><span className="navbar-text">Messages</span></RaisedButton>
          </Link>
        </ToolbarGroup>
      }
      <ToolbarGroup>
        {props.isLoggedIn ?
          <RaisedButton
            id="logout"
            onClick={logout}
          ><span className="navbar-text">Logout</span>
          </RaisedButton> :
          <Link to="/login">
            <RaisedButton><span className="navbar-text">Login</span></RaisedButton>
          </Link>}
      </ToolbarGroup>
    </Toolbar>
  );
};

export default Navbar;
