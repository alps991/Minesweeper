var path = require('path');
var express = require('express');
// static file compression middleware
var compress = require('compression');
// middleware that allows you to parse request body, json, etc.
var bodyParser = require('body-parser');
// middleware to allow the general use of PUT and DELETE verbs
var methodOverride = require('method-override');
// logging middleware
var morgan = require('morgan');
// middleware to return X-Response-Time with a response
var responseTime = require('response-time');

var app = express();

app.use(morgan('dev'));
app.use(responseTime());

app.use(bodyParser());
app.use(methodOverride());

app.use(compress());

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000);

console.log('server started on port: ', process.env.PORT || 3000);