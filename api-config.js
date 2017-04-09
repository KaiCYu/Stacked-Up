// StackedUp API Keys list

// facebook api key for authentication
const facebookApiKey = {
  clientID: '1371564976271259',
  clientSecret: 'd3c4d22eb915d3b64065028db9e45882',
  callbackURL: '/auth/facebook/callback',
};
// google api key for authentication
const GoogleOAuthApiKey = {
  clientID: '289908654262-7i38556n6iu5bjfah067erchjqevskif.apps.googleusercontent.com',
  clientSecret: 'CyETn4dwuYO47bga64SVaB5Y',
  callbackURL: '/auth/google/callback',
};

exports.facebookApiKey = facebookApiKey;
exports.GoogleOAuthApiKey = GoogleOAuthApiKey;
