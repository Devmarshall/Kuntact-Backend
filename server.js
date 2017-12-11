var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cors = require('cors');
var textSearch = require('mongoose-text-search');

var app = express();
var PORT = 3004
var mongoUrl = 'mongodb://localhost:27017/Kuntact';

var routes = require('./routes.js')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(morgan('dev'));

mongoose.connect(mongoUrl);

// Routes

app.post('/api/profile/signup', routes.SignUp);

app.post('/api/profile/login', routes.Login);

app.post('/api/profile/addskill', routes.addSkill);

app.post('/api/search', routes.Search);

var server = app.listen(PORT, 'localhost', function () {
    var serverAddr = server.address().address;
    var serverPort = server.address().port;

    console.log('Server listening at ' + serverAddr + ':' + serverPort);
});