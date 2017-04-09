import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import $ from 'jquery';


class Search extends React.Component {

  constructor(props) {
    super(props);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidUpdate() {
    console.log('componentDidMount props.searchApplicantsResults = ', this.props.searchApplicantsResults)
    var applicants = this.props.searchApplicantsResults;
    if (applicants && applicants.length>0) {
      applicants.forEach(function(applicant) {
        $('.table-inbox tbody').append(
          '<tr>\
            <td>'+applicant.username+'</td>\
            <td>'+applicant.fullname+'</td>\
            <td>'+applicant.resume_url+'</td>\
            <td>'+applicant.online+'</td>\
          </tr>'
        ); 
      })
    }


  }

  handleSearchSubmit(event) {
    event.preventDefault();
    console.log('submitted')
    this.props.sendSearchInfo();
  }

  handleInputChange(event) {
    this.props.onInputChange(event)
  }

  render() {
    return (
      <div className="search-container">
        <h1>Search</h1>
        <div>
          <Link to="/employerProfile">View this Employer</Link>
        </div>
        <div>
          <Link to="/profile">View this Candidate</Link>
        </div>
        <form ref='search'
            onSubmit={this.handleSearchSubmit}>
            <input
              type='text'
              name="searchUsername"
              placeholder='ID'
              onChange={this.handleInputChange}
            />
            <button
              type='submit'
            >Search</button>
        </form>
        <table className="table table-striped table-inbox hidden">
          <thead>
            <tr>
              <th>Userame</th>
              <th>Full Name</th>
              <th>Link to Resume</th>
              <th>Online Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div>
          <Link to="/jobPost">View this Job Post</Link>
        </div>
      </div>
    )
  }
}

export default Search;