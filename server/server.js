const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.static(__dirname + '/../app/dist'))



const port = 8000;

app.listen(process.env.PORT || port, () => {
  /* eslint-disable no-console */
  console.log(`Server now listening on port ${port}`);
  /* eslint-enable no-console */


});
