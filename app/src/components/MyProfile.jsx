import React from 'react';
import { Link } from 'react-router-dom';

const MyProfile = (props) => (
  <div className="search-container">
    <h1>MyProfile</h1>
    <div>
      MyProfile Page Displayed Here
    </div>
    <Link to="/postingjob">Post job</Link>
  </div>
);

export default MyProfile;
