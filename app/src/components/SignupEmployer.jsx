import React from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
// import FormInput from './FormInput';
import TextField from 'material-ui/TextField';
import { black, blue500 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
// import Dropzone from './Dropzone';

class SignupEmployer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      companyName: '',
      email: '',
      phoneNumber: '',
      city: '',
      state: '',
      country: '',
      logo: '',
    };
    this.initialState = this.state;

    this.previewFile = this.previewFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onResetForm = this.onResetForm.bind(this);
  }

  onInputChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  onResetForm() {
    this.setState(this.initialState);
  }
  
  previewFile(event) {
    const name = event.target.name;
    const preview = document.querySelector('#preview');
    console.log(document.getElementById(`${name}`));
    const file = document.getElementById(`${name}`).files[0];
    console.log('FILE', file);

    const reader = new FileReader();

    const addDemoImage = () => {
      const demoImage = new Image();
      demoImage.height = 100;
      demoImage.title = file.name;
      demoImage.src = 'http://res.cloudinary.com/dse6qhxk5/image/upload/v1493338548/hacz9nec5ih7qezbt4kk.jpg';
      preview.appendChild(demoImage);
    };

    reader.addEventListener("loadend", () => {
      if (file.type === 'application/msword' || file.type === 'application/pdf') {
        addDemoImage();
      } else {
        preview.src = reader.result;
      }
    }, false);

    reader.onloadend = () => {
      this.setState({ [name]: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const applicantData = this.state;

    $.ajax({
      type: 'POST',
      url: '/signupEmployer',
      data: applicantData,
      success: (results) => {
        console.log('signed up as an employer!');
        this.props.history.push('/login');
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error);
      },
    });
  }

  render() {
    return (
      <div className="SignupEmployer-container">
        <div className="signup-header">
          <h1>Signup as a Employer</h1>
        </div>
        <form id="signupEmployer" onSubmit={this.handleSubmit}>
          <TextField
            hintText="TheBomb.com"
            floatingLabelText="Username*"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.username}
            name={'username'}
            floatingLabelStyle={styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            floatingLabelText="Password*"
            floatingLabelFixed={true}
            type={'password'}
            value={this.state.password}
            name={'password'}
            floatingLabelStyle={styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <br />
          <TextField
            hintText="Awesome Company"
            floatingLabelText="Company Name*"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.companyName}
            name={'companyName'}
            floatingLabelStyle={styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            hintText="awesomecompany@awesome.com"
            floatingLabelText="Email*"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.email}
            name={'email'}
            floatingLabelStyle={styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            hintText="(123)456-7890"
            floatingLabelText="Phone Number"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.phoneNumber}
            name={'phoneNumber'}
            floatingLabelStyle={styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <br/>
          <TextField
            hintText="San Francisco"
            floatingLabelText="City"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.city}
            name={'city'}
            floatingLabelStyle={styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            hintText="CA"
            floatingLabelText="State"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.state}
            name={'state'}
            floatingLabelStyle={styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            hintText="USA"
            floatingLabelText="Country"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.country}
            name={'country'}
            floatingLabelStyle={styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <FlatButton
            label="Upload a Company Logo"
            labelPosition="before"
            style={styles.uploadButton}
            containerElement="label"
          >
            <input
              type="file"
              id={'logo'}
              name={'logo'}
              style={styles.uploadInput}
              onChange={this.previewFile} 
            />
          </FlatButton>
          <p>*Required</p>

          <br />
          {/*<Dropzone />*/}
          <img id="preview" src="" height="150px"></img>

          <br />
          <FlatButton
            label="Sign Up"
            labelPosition="before"
            style={styles.uploadButton}
            containerElement="label"
          >
            <input
              type="submit"
              style={styles.uploadInput}
            />
          </FlatButton>
          <FlatButton
            label="Clear"
            labelPosition="before"
            style={styles.uploadButton}
            containerElement="label"
          >
            <input
              onClick={this.onResetForm}
              style={styles.uploadInput}
            />
          </FlatButton>
        </form>
      </div>
    );
  }
}

export default SignupEmployer;

const styles = {
  floatingLabelStyle: {
    color: black,
  },
  uploadButton: {
    verticalAlign: 'middle',
    color: blue500,
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};
