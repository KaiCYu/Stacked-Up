import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

const Profile = (props) => (
  <div className='search-container'>
    <h1>Profile</h1>
    <div>
      Profile Page Displayed Here
    </div>
    <div>
      <Link
        to='/streamVideo'>
      Interview this candidate now!</Link><br />
    </div>
    <form>
      <input>
      </input>
      <button>Submit></button>
    </form>
  </div>
);

export default Profile;
