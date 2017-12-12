var mongoose = require('mongoose');
var random = require('random-key');

var serviceSchema = mongoose.Schema({

    token: String,
    userToken: String,
    Name: String,
    serviceCategory: String,
    Description: String,
    Reviews: [{
        Score: Number,
        Comment: String
    }],
    ReviewScore: Number

})

module.exports = mongoose.model('Service', serviceSchema);