const express = require('express');
const path = require('path')

const app = express();
app.use('/src', express.static(path.join(__dirname, 'src')));
app.get('/', function(_, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
  });
  
const listener = app.listen(8080, function() {
  console.log('Your app running at http://localhost:' + listener.address().port);
});
