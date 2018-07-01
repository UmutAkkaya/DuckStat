const express = require('express');
const mongoose = require('mongoose');
const dbUrl = 'mongodb://159.65.163.80/duckStats'
const routes = require('./routes');
const app = express();
const port = process.env.PORT || 5000;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());

// Connect to duckStats db
mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database Connection error:'));
db.once('open', function() {
  console.log(`MongoDB connection established to ${dbUrl}`);
});

app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));