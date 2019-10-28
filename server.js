var express = require('express');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var articleRoutes = require('./routes/article');
var indexRoutes = require('./routes/index');
var path = require('path');
var logger = require('morgan');

// turn on debugging
mongoose.set('debug', true);

var PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();
// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set handlebars as the default templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Connect to the Mongo DB 
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoScraper';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Define which routes to use
app.use('/', indexRoutes);
app.use('/articles', articleRoutes);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!")
});
