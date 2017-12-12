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
    ReviewScore: Number,
    dateCreated: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Service', serviceSchema);