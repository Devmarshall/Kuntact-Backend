var mongoose = require('mongoose');
var random = require('random-key');

var serviceCategorySchema = mongoose.Schema({

    Name: String,
    services: [{
        id: String
    }]

});