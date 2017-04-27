import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import SearchResultsTable from './SearchResultsTable';
import utils from '../../../lib/utility';

const Search = ({ searchResults }) => (
  <div className="search-container">
    <h3>Search Results Found: {utils.sumPropsLengths(searchResults)}</h3>
    <SearchResultsTable searchResults={searchResults} />
  </div>
);

export default Search;
