var mongoose = require('mongoose');
var random = require('random-key');

var serviceSchema = mongoose.Schema({

    userToken: String,
    Name: String,
    serviceCategory: String,
    Description: String,
    id: String,
    Reviews: [{
        Score: Number,
        Comment: String
    }],
    ReviewScore: Number

})

module.exports = mongoose.model('Service', serviceSchema);