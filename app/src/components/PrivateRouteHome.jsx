import React from 'react' ;
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

const PrivateRouteHome = () => (
  <Redirect to="/main" />
);

export default PrivateRouteHome;

