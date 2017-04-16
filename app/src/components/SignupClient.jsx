import React from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
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
      // currentEmployer: '',
      // currentSchool: '',
      city: '',
      state: '',
      country: '',
      resume: '',
      coverLetter: '',
      profilePhoto: '',
    };
    this.initialState = this.state;

    this.previewFile = this.previewFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onResetForm = this.onResetForm.bind(this);
  }

  previewFile(event) {
    const name = event.target.name;
    console.log('NAME', name);

    //store the preview in state ==> faster to get.
    const preview = document.querySelector(`#${name}`);
    // console.log('PREVIEW', preview);
    const file = document.getElementById(`${name}`).files[0];
    console.log('FILE *************: ', file);

    const reader  = new FileReader();

    reader.onloadend = () => {
      console.log('READER: ', reader);
      this.setState({ [name]: reader.result });
    };

    reader.addEventListener("loadend", () => {
      console.log('read the picture******************');
      preview.src = reader.result;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
    // if (file && file.type === 'text/plain') {
    //   reader.readAsText(file);
    // } else {
    //   reader.readAsDataURL(file);
    // }
  }

  onInputChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  onResetForm() {
    const form = ReactDOM.findDOMNode(signupApplicant);
    form.reset();
    this.setState(this.initialState);
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
        console.log('signed up as an applicant!', results);
        this.props.history.push('/main');
      },
      error: (error) => {
        console.log('error on getting profile from server // error', error);
      },
    });
  }

  render() {
    return (
      <div className="SignupClient-container">
        <h1>Signup as a Client</h1>
        <form id="signupApplicant" onSubmit={this.handleSubmit}>
          <label>Username*:
            <input type="text" name="username" placeholder="AwesomeEngineer" onChange={this.onInputChange} />
          </label>
          <label>Password*:
            <input type="password" name="password" onChange={this.onInputChange} />
          </label>
          <br  />
          <label>First Name*:
            <input type="text" name="firstName" placeholder="First Name" onChange={this.onInputChange} />
          </label>
          <label>Last Name*:
            <input type="text" name="lastName" placeholder="Last Name" onChange={this.onInputChange} />
          </label>
          <br  />
          <label>Email:
            <input type="text" name="email" placeholder="janedoe@stackedup.com" onChange={this.onInputChange} />
          </label>
          <label>Phone Number*:
            <input type="text" name="phoneNumber" placeholder="(000)000-0000" onChange={this.onInputChange} />
          </label>
          <br  />
          <label>City:
            <input type="text" name="city" placeholder="City" onChange={this.onInputChange} />
          </label>
          <label>State:
            <input type="text" name="state" placeholder="State" onChange={this.onInputChange} />
          </label>
          <label>Country:
            <input type="text" name="country" placeholder="Country" onChange={this.onInputChange} />
          </label><br />
          <label> Upload your resume
            <input
              id="resume"
              type="file"
              name="resume"
              onChange={this.previewFile} /><br />
          </label>
          <label> Upload your cover letter
            <input
              id="coverLetter"
              type="file"
              name="coverLetter"
              onChange={this.previewFile} /><br />
          </label>
          <label> Upload your photo
            {/*name={this.state.profilePicture}*/}
            <input
              id="profilePhoto"
              type="file"
              name="profilePhoto"
              onChange={this.previewFile}
            /><br />
          </label>

          <p>*Required</p>

          <br />
          <img className="previewImage" src="" height="200" alt="Image preview..."></img>

          {/*<Dropzone />*/}
          
          <br />
          <input type="submit" value="sign up" />
          <button onClick={this.onResetForm}>Clear</button>
        </form>

          {/*if we need ajax post call on applicant sign up*/}
          {/*<Link to="/applicantProfile" onClick={props.submitApplicant}>Submit</Link>*/}
          
      </div>
    )};
}

export default SignupClient;

