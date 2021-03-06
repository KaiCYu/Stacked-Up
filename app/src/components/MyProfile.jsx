import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import { blue700 } from 'material-ui/styles/colors';
import EmployerProfile from './EmployerProfile';
import ApplicantProfile from './ApplicantProfile';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
    };
  }

  componentWillMount() {
    $.ajax({
      url: '/getCurrentUser',
      type: 'GET',
      success: (currentUser) => {
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
        {/*{console.log('HISTORY', this.props.history)}*/}
        <div>
          { this.props.option === 'company' ?
            <EmployerProfile info={this.state.currentUser} /> :
            <ApplicantProfile history={this.props.history} info={this.state.currentUser} /> }
        </div>
        {this.props.option === 'company' ?
          <Link to="/postingjob">
            <FlatButton label="Post new job" primary fullWidth />
          </Link>
          : null}
      </div>
    );
  }
}

export default MyProfile;
