var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    userName: String,
    local: {
        email: String,
        password: String
    },
    signUpDate: {
        type: Date,
        default: Date.now
    },
    services: [{
        id: String
    }],
    products: [{
        id: String
    }],
    phoneNumber: String,
    PhysicalLocation: [{
        BuildingNo: Number,
        Street: String,
        City: String,
        State: String
    }],
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