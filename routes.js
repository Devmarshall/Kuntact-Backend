var mongoose = require('mongoose');
var User = require('./models/user.js');
var random = require('random-key');

module.exports.SignUp = function (req, res) {

    // First check if user email or username is taken is taken before signup

    User.findOne({ 'local.email': req.body.email }, function (err, results) {
        if (err) {
            console.log(err)
        } else {
            if (results) {
                res.json({
                    unavailableParameter: 'Email'
                })
            } else {
                User.findOne({ 'userName': req.body.userName }, function (err2, results2) {
                    if (err) {
                        console.log(err2);
                    } else {
                        if (results2) {
                            res.json({
                                unavailableParameter: 'userName'
                            })
                        } else {
                            var newUser = new User();

                            newUser.userName = req.body.userName;
                            newUser.phoneNumber = req.body.phoneNumber;
                            newUser.local.email = req.body.email;
                            newUser.local.password = newUser.generateHash(req.body.password);
                            newUser.token = random.generate();

                            newUser.save().then(function () {

                                User.findOne({ 'token': newUser.token }, '-local.password', function (err3, currentUser) {
                                    if (err3) {
                                        console.log(err3);
                                        res.error(err3)
                                    } else {
                                        res.json(currentUser);
                                    }
                                })
                            }, function (err) {
                                console.log(err);
                                res.error(err);
                            })
                        }
                    }
                })
            }
        }
    })

}

module.exports.Login = function (req, res) {

    User.findOne({ 'local.email': req.body.email }, function (err, user) {
        if (err) {
            res.error(err);
        } else {
            if (!user || !user.validPassword(req.body.password)) {
                res.json({ errorMsg: 'Invalid Details' })
            } else {

                // res.json({
                //     userName: user.userName,
                //     phoneNumber: user.phoneNumber,
                //     email: user.local.email,
                //     token: user.token
                // })

                User.findOne({ 'token': user.token }, '-local.password', function (err2, currentUser) {
                    if (err2) {
                        console.log(err2);
                        res.error(err2);
                    } else {
                        res.json(currentUser);
                    }
                })

            }
        }
    })

}

module.exports.addSkill = function (req, res) {
    User.findOne({ 'token': req.body.userToken }, function (err, user) {

        if (err) {
            console.log(err);
            res.error(err);
        } else {
            user.mySkills.push(req.body.skillData);

            user.save().then(function () {
                res.json(user);
            }, function (err2) {
                res.error(err2);
            })
        }

    });
}

module.exports.getUser = function (req, res) {

    User.findOne({ 'token': req.body.userToken }, '-local.password', function (err, user) {
        if (err) {
            console.log(err);
            res.error(err);
        } else {
            res.json(user);
        }
    })

}

module.exports.getAllSkills = function (req, res) {

    var allSkills = [];

    User.find({}, function (err, allUsers) {

        if (err) {
            console.log(err);
            res.error(err)
        } else {
            allUsers.forEach(function (user) {
                allSkills.push(user.mySkills.Name)
            });

            res.json(allSkills);
        }
    })
}

module.exports.Search = function (req, res) {

    console.log(req.body)
    var currentUserToken = req.body.currentUserToken;

    var params = {
        $or: [
            { 'userName': { '$regex': req.body.searchString, '$options': 'i' } },
            { 'mySkills.Name': { '$regex': req.body.searchString, '$options': 'i' } },
            { 'mySkills.Description': { '$regex': req.body.searchString, '$options': 'i' } },
            { 'phoneNumber': { '$regex': req.body.searchString, '$options': 'i' } },
            { 'local.email': { '$regex': req.body.searchString, '$options': 'i' } }],
        $and: [{ 'token': { $ne: currentUserToken } }]
    };

    // Yeah I had to borrow Somto's crappy code 😒
    // params = { $or: [{ "discription": { '$regex': d, '$options': 'i' } }, { 'name': { '$regex': d, '$options': 'i' } }] }

    User.find(params).exec(function (err, results) {
        if (err) {
            res.json({
                errorMsg: 'Search Error'
            })
            console.log(err);
        } else {
            console.log(results);
            if (results.length > 0) {
                res.json(results);
            } else {
                res.json({
                    errorMsg: 'No results found'
                })
            }
        }
    })
}