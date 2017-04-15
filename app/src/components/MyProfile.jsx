import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import EmployerProfile from './EmployerProfile';
import ApplicantProfile from './ApplicantProfile';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    $.ajax({
      url: '/getCurrentUser',
      type: 'GET',
      success: (currentUser) => {
        console.log(this.props);
        console.log('currentUser profile! : ', currentUser);
        this.setState({ currentUser: currentUser });
      },
      error: (error) => {
        console.log('failed to retrieve current user data due to =>>>', error);
      }
    });
  }

  render() {
    return (
      <div className="search-container">
        <div>
          { this.props.option === 'company' ?
            <EmployerProfile info={this.state.currentUser} /> :
            <ApplicantProfile info={this.state.currentUser} /> }
        </div>
        {this.state.option === 'company' ? <Link to="/postingjob">Post job</Link> : null}
      </div>
    );
  }
}

export default MyProfile;
