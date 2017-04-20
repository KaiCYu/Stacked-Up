import React from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import FormInput from './FormInput';
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
    this.initialState = this.state;

    this.previewFile = this.previewFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onResetForm = this.onResetForm.bind(this);
  }

  onInputChange(event) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    });
  }

  onResetForm() {
    this.setState(this.initialState);
  }

  previewFile(event) {
    const name = event.target.name;
    // console.log('NAME', name);

    //store the preview in state ==> faster to get.
    const preview = document.querySelector('#preview');
    // console.log('PREVIEW', preview);
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
      <div className="SignupClient-container">
        <h1>Signup as a Client</h1>
        <form id="signupApplicant" onSubmit={this.handleSubmit}>
          <FormInput title={'Username*'} type={'text'} value={this.state.username} name={'username'} placeholder={'AwesomeEngineer'} onChange={this.onInputChange} />
          <FormInput title={'Password*'} type={'password'} value={this.state.password} name={'password'} onChange={this.onInputChange}/> <br />
          <FormInput title={'First Name*'} type={'text'} value={this.state.firstName} name={'firstName'} placeholder={'Erik'} onChange={this.onInputChange}/>
          <FormInput title={'Last Name*'} type={'text'} value={this.state.lastName} name={'lastName'} placeholder={'Brown'} onChange={this.onInputChange}/> <br />
          <FormInput title={'E-mail*'} type={'text'} value={this.state.email} name={'email'} placeholder={'awesomebot@gmail.com'} onChange={this.onInputChange}/>
          <FormInput title={'Phone Number'} type={'text'} value={this.state.phoneNumber} name={'phoneNumber'} placeholder={'(123)456-7890'} onChange={this.onInputChange}/> <br />
          <FormInput title={'City'} type={'text'} value={this.state.city} name={'city'} placeholder={'San Francisco'} onChange={this.onInputChange}/>
          <FormInput title={'State'} type={'text'} value={this.state.state} name={'state'} placeholder={'California'} onChange={this.onInputChange}/>
          <FormInput title={'Country'} type={'text'} value={this.state.country} name={'country'} placeholder={'USA'} onChange={this.onInputChange}/> <br />

          <FormInput title={'Upload your resume'} id={"resume"} type={"file"} name={"resume"} onChange={this.previewFile} /> <br />
          <FormInput title={'Upload your cover letter'} id={"coverLetter"} type={"file"} name={"coverLetter"} onChange={this.previewFile} /> <br />
          <FormInput title={'Upload your photo'} id={"profilePhoto"} type={"file"} name={"profilePhoto"} onChange={this.previewFile} />

          <br/>
          <p>*Required</p>

          <br />
          <div id="preview"></div>

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

