var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cors = require('cors');

var app = express();
var PORT = 3010;
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

app.get('/api/user/getuser', routes.getUser);

app.get('/api/user/getallusers', routes.getAllUsers);

app.post('/api/user/signup', routes.SignUp);

app.post('/api/user/login', routes.Login);

app.post('/api/user/addservice', routes.addService);

app.get('/api/service/getservice', routes.getService);

app.get('/api/service/getallservices', routes.getAllServices);

app.get('/api/product/getproduct', routes.getProduct);

app.get('/api/product/getallproducts', routes.getAllProducts);



var server = app.listen(PORT, 'localhost', function () {
    var serverAddr = server.address().address;
    var serverPort = server.address().port;

    console.log('Kuntact-Backend listening at ' + serverAddr + ':' + serverPort);
});