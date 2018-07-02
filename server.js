const express = require('express');
const mongoose = require('mongoose');
const dbUrl = 'mongodb://159.65.163.80/duckStats'
const routes = require('./routes');
const app = express();
const port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());

// Connect to duckStats db
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database Connection error:'));
db.once('open', function() {
  console.log(`MongoDB connection established to ${dbUrl}`);
});

app.use('/', routes);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));