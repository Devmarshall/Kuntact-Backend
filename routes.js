var mongoose = require('mongoose');
var User = require('./models/user.js');
var random = require('random-key');

module.exports.SignUp = function (req, res) {

    // First check if user email or username is taken is taken before signup

    User.findOne({
        'local.email': req.body.email
    }, function (err, results) {
        if (err) {
            console.log(err)
        } else {
            if (results) {
                res.json({
                    unavailableParameter: 'Email'
                })
            } else {
                var newUser = new User();

                newUser.Name = req.body.Name;
                newUser.phoneNumber = req.body.phoneNumber;
                newUser.local.email = req.body.email;
                newUser.local.password = newUser.generateHash(req.body.password);
                newUser.token = random.generate();

                newUser.save().then(function () {
                    console.log('SignUp Successfull')
                    console.log(newUser)
                    res.json(newUser);
                }, function (err) {
                    console.log(err);
                })

            }
        }
    })

}

module.exports.Login = function (req, res) {

    User.findOne({
        'local.email': req.body.email
    }, function (err, user) {
        if (err) {
            res.error(err);
        } else {
            if (!user || !user.validPassword(req.body.password)) {
                res.json({
                    errorMsg: 'Invalid Details'
                })
            } else {

                User.findOne({
                    'token': user.token
                }, '-local.password', function (err2, currentUser) {
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
    User.findOne({
        'token': req.body.userToken
    }, function (err, user) {

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

    User.findOne({
        'token': req.body.userToken
    }, '-local.password', function (err, user) {
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
        $or: [{
                'userName': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            },
            {
                'mySkills.Name': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            },
            {
                'mySkills.Description': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            },
            {
                'phoneNumber': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            },
            {
                'local.email': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            }
        ],
        $and: [{
            'token': {
                $ne: currentUserToken
            }
        }]
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