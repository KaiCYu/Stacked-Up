import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

const Search = (props) => (
  <div className='search-container'>
    <h1>Search</h1>
    <div>
    	<Link to="/employerProfile">View this Employer</Link>
  	</div>
  	<div>
  		<Link to="/profile">View this Candidate</Link>
  	</div>
  	<div>
  		<Link to="/jobPost">View this Job Post</Link>
  	</div>
  </div>
)

export default Search;