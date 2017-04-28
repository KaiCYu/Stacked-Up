import React from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import FormInput from './FormInput';
import TextField from 'material-ui/TextField';
import { black, blue500 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import {Grid, Row, Column} from 'react-cellblock';

// import Dropzone from './Dropzone';

class SignupClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      city: '',
      state: '',
      country: '',
      resume: '',
      coverLetter: '',
      profilePhoto: '',
    };
    this.styles = {
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
    },
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
    console.log('NAME', name);

    const preview = document.querySelector(`#${name}-preview`);
    console.log('PREVIEW', preview);
    const file = document.getElementById(`${name}`).files[0];
    // console.log('FILE *************: ', file);

    const reader = new FileReader();

    reader.onloadend = () => {
      // console.log('READER: ', reader);
      this.setState({ [name]: reader.result });
    };

    reader.addEventListener("loadend", () => {
      // console.log('read the picture******************');
      const image = new Image();
      image.height = 100;
      image.title = file.name;
      image.src = reader.result;
      preview.appendChild(image);
    }, false);

    if (file && file.type === 'text/plain') {
      reader.readAsText(file);
    }
    if (file && file.type !== 'text/plain') {
      reader.readAsDataURL(file);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    // console.log('inside handle submit');
    const applicantData = this.state;
    $.ajax({
      type: 'POST',
      url: '/signupApplicant',
      data: applicantData,
      success: (results) => {
        console.log('signed up as an applicant!');
        this.props.history.push('/login');
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error);
      },
    });
  }

  render() {
    return (
      <div className="signup-client-container">
        <h1>Signup as a Client</h1>
        <form id="signupApplicant" onSubmit={this.handleSubmit}>
          <TextField
            hintText="AwesomeEngineer"
            floatingLabelText="Username*"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.username}
            name={'username'}
            floatingLabelStyle={this.styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            floatingLabelText="Password*"
            floatingLabelFixed={true}
            type={'password'}
            value={this.state.password}
            name={'password'}
            floatingLabelStyle={this.styles.floatingLabelStyle}
            onChange={this.onInputChange}
          /><br />
          <TextField
            hintText="Erik"
            floatingLabelText="First Name*"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.firstName}
            name={'firstName'}
            floatingLabelStyle={this.styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            hintText="Brown"
            floatingLabelText="Last Name*"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.lastName}
            name={'lastName'}
            floatingLabelStyle={this.styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <br />
          <TextField
            hintText="awesomebot@gmail.com"
            floatingLabelText="Email"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.email}
            name={'email'}
            floatingLabelStyle={this.styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            hintText="(123)456-7890"
            floatingLabelText="Phone Number"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.phoneNumber}
            name={'phoneNumber'}
            floatingLabelStyle={this.styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <br />
          <TextField
            hintText="San Francisco"
            floatingLabelText="City"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.city}
            name={'city'}
            floatingLabelStyle={this.styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            hintText="CA"
            floatingLabelText="State"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.state}
            name={'state'}
            floatingLabelStyle={this.styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <TextField
            hintText="USA"
            floatingLabelText="Country"
            floatingLabelFixed={true}
            type={'text'}
            value={this.state.country}
            name={'country'}
            floatingLabelStyle={this.styles.floatingLabelStyle}
            onChange={this.onInputChange}
          />
          <br />

          <Grid height="300px">
            <Column width="1/3" height="300px">
              <FlatButton
                label="Upload a resume"
                labelPosition="before"
                style={this.styles.uploadButton}
                containerElement="label"
              >
                <input
                  type="file"
                  id={'resume'}
                  name={'resume'}
                  style={this.styles.uploadInput}
                  onChange={this.previewFile}
                />
              </FlatButton>
              <div id="resume-preview" height="300px"></div>
            </Column>

            <Column width="1/3" height="300px">
              <FlatButton
                label="Upload a cover letter"
                labelPosition="before"
                style={this.styles.uploadButton}
                containerElement="label"
              >
                <input
                  type="file"
                  id={'coverLetter'}
                  name={'coverLetter'}
                  style={this.styles.uploadInput}
                  onChange={this.previewFile}
                />
              </FlatButton>
              <div id="coverLetter-preview" height="300px"></div>
            </Column>

            <Column width="1/3" height="300px">
              <FlatButton
                label="Upload a profile picture"
                labelPosition="before"
                style={this.styles.uploadButton}
                containerElement="label"
              >
                <input
                  type="file"
                  id={'profilePhoto'}
                  name={'profilePhoto'}
                  style={this.styles.uploadInput}
                  onChange={this.previewFile}
                />
              </FlatButton>
              <div id="profilePhoto-preview" height="300px"></div>
            </Column>
          </Grid>

          {/*<Dropzone />*/}

          <br />
          <FlatButton
            label="Sign Up"
            labelPosition="before"
            style={this.styles.uploadButton}
            containerElement="label"
          >
            <input
              type="submit"
              style={this.styles.uploadInput}
            />
          </FlatButton>
          <FlatButton
            label="Clear"
            labelPosition="before"
            style={this.styles.uploadButton}
            containerElement="label"
          >
            <input
              onClick={this.onResetForm}
              style={this.styles.uploadInput}
            />
          </FlatButton>

        </form>
      </div>
    )};
}

export default SignupClient;

