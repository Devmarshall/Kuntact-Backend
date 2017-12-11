var mongoose = require('mongoose');
var random = require('random-key');

var productCategorySchema = mongoose.Schema({
    Name: String,
    products: [{
        id: String
    }]

});

module.exports = mongoose.model('ProductCategory', productCategorySchema);