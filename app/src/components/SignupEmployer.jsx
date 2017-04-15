import React from 'react';
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
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

    this.previewFile = this.previewFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  previewFile(event) {
    const name = event.target.name;
    console.log('NAME', name);

    //store the preview in state ==> faster to get.
    const preview = document.querySelector(`#${name}`);
    // console.log('PREVIEW', preview);
    const file = document.getElementById(`${name}`).files[0];
    console.log('FILE *************: ', file);

    const reader = new FileReader();

    reader.addEventListener("loadend", () => {
      console.log('read the picture******************');
      preview.src = reader.result;
    }, false);

    reader.onloadend = () => {
      console.log('READER: ', reader);
      this.setState({ [name]: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  handleSubmit(event) {
    // const self = this;
    event.preventDefault();
    // console.log('inside handle submit');
    const applicantData = this.state;

    $.ajax({
      type: 'POST',
      url: '/signupEmployer',
      data: applicantData,
      success: (results) => {
        console.log('signed up as an employer!');
        this.props.history.push('/main');

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
        <form onSubmit={this.handleSubmit}>
          <label>Username*:
            <input type="text" name="username" placeholder="username" onChange={this.onInputChange} />
          </label>
          <label>Password*:
            <input type="password" name="password" onChange={this.onInputChange} />
          </label>
          <br  />
          <label>Company Name*:
            <input type="text" name="companyName" placeholder="compnay name" onChange={this.onInputChange} />
          </label>
          <br  />
          <label>Email:
            <input type="text" name="email" placeholder="company@stackedup.com" onChange={this.onInputChange} />
          </label>
          <label>Phone Number*:
            <input type="text" name="phoneNumber" placeholder="(000)000-0000" onChange={this.onInputChange} />
          </label>
          <br />
          <label>City:
            <input type="text" name="city" placeholder="City" onChange={this.onInputChange} />
          </label>
          <label>State:
            <input type="text" name="state" placeholder="State" onChange={this.onInputChange} />
          </label>
          <label>Country:
            <input type="text" name="country" placeholder="Country" onChange={this.onInputChange} />
          </label><br />
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
          {/*<img className="previewImage" src="" height="200" alt="Image preview..."></img>*/}

          {/*<Dropzone />*/}

          <br />
          <input type="submit" value="sign up" />
        </form>
        <button>Cancel</button>
      </div>
    );
  }
}

export default SignupEmployer;

