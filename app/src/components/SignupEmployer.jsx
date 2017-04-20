import React from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import FormInput from './FormInput';
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

  previewFile(event) {
    const name = event.target.name;
    // console.log('NAME', name);

    //store the preview in state ==> faster to get.
    const preview = document.querySelector('#preview');
    // console.log('PREVIEW', preview);
    const file = document.getElementById(`${name}`).files[0];
    // console.log('FILE *************: ', file);

    const reader = new FileReader();

    reader.addEventListener("loadend", () => {
      // console.log('read the picture******************');
      preview.src = reader.result;
    }, false);

    reader.onloadend = () => {
      // console.log('READER: ', reader);
      this.setState({ [name]: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  onResetForm() {
    this.setState(this.initialState);
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
        <h1>Signup as a Employer</h1>
        <form id="signupEmployer" onSubmit={this.handleSubmit}>
          <FormInput title={'Username*'} type={'text'} value={this.state.username} name={'username'} placeholder={'Awesome Company'} onChange={this.onInputChange} />
          <FormInput title={'Password*'} type={'password'} value={this.state.password} name={'password'} placeholder={'password'} onChange={this.onInputChange} /> <br />
          <FormInput title={'Company Name*'} type={'text'} value={this.state.companyName} name={'companyName'} placeholder={'Awesome Company'} onChange={this.onInputChange} />
          <FormInput title={'Email*'} type={'text'} value={this.state.email} name={'email'} placeholder={'awesomecompany@awesome.com'} onChange={this.onInputChange} />
          <FormInput title={'Phone Number*'} type={'text'} value={this.state.phoneNumber} name={'phoneNumber'} placeholder={'(123)456-7890'} onChange={this.onInputChange} /> <br />
          <FormInput title={'City'} type={'text'} value={this.state.city} name={'city'} placeholder={'San Francisco'} onChange={this.onInputChange} />
          <FormInput title={'State'} type={'text'} value={this.state.state} name={'state'} placeholder={'California'} onChange={this.onInputChange} />
          <FormInput title={'Country'} type={'text'} value={this.state.country} name={'country'} placeholder={'USA'} onChange={this.onInputChange} />
          <br />
          <label> Upload Logo Photo
            <input
              id="logo"
              type="file"
              name="logo"
              onChange={this.previewFile}
            /><br />
          </label>

          <p>*Required</p>

          <br />
          {/*<Dropzone />*/}
          <img id="preview" src="" height="200" alt="Image preview..."></img>

          <br />
          <input type="submit" value="sign up" />
          <button onClick={this.onResetForm}>Clear</button>
        </form>


      </div>
    );
  }
}

export default SignupEmployer;