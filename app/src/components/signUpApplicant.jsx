import React from 'react';

class SignUpApplicant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <p> welcome! </p>
        <span> Name: </span><input type="text" /><br />
        <span> Address: </span><input type="text" /><br />
        <span> Phone Number: </span><input type="text" /><br />
        <span> upload your resume </span><br />
        <span> upload your cover letter </span><br />
        <span> upload your picture </span><br />
        <button>Sign up</button>
        <button>Cancel</button>
      </div>
    );
  }
}

export default SignUpApplicant;
