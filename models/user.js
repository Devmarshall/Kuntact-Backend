var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    Name: {
        firstName: String,
        surName: String
    },
    profileImg: String,
    local: {
        email: String,
        password: String
    },
    signUpDate: {
        type: Date,
        default: Date.now
    },
    services: [{
        serviceToken: String
    }],
    products: [{
        productToken: String
    }],
    phoneNumber: String,
    token: String

});

// Schema methods

// Generate password hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
// Check if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);