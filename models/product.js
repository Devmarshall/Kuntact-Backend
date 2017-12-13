var mongoose = require('mongoose');
var random = require('random-key');

var productSchema = mongoose.Schema({

    userToken: String,
    token: String,
    Name: String,
    Description: String,
    Category: String,
    Price: Number,
    AmountInStock: Number,
    Images: {
        img1: String,
        img2: String,
        img3: String
    },
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

module.exports = mongoose.model('Product', productSchema);