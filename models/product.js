var mongoose = require('mongoose');
var random = require('random-key');

var productSchema = mongoose.Schema({

    userToken: String,
    id: String,
    Name: String,
    Description: String,
    productCategory: String,
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
    ReviewScore: Number
});

module.exports = mongoose.model('Product', productSchema);