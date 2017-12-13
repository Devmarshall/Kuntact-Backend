var mongoose = require('mongoose');
var random = require('random-key');

var serviceSchema = mongoose.Schema({

    token: String,
    Location: {
        latitude: Number,
        longtitude: Number
    },
    userToken: String,
    Name: String,
    Category: String,
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

});

module.exports = mongoose.model('Service', serviceSchema);