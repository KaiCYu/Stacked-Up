import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => (
  <div className="main-container">
    <h1>Choose your type of SignUp</h1>
    <div>
      <Link to="/SignUpApplicant"><button value="As an applicant" /></Link>
      <button value="As a corporate" />
    </div>
  </div>
);

export default SignUp;
