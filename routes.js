var mongoose = require('mongoose');
var User = require('./models/user.js');
var Service = require('./models/service.js');
var ServiceCategory = require('./models/servicecategory.js');
var Product = require('./models/product.js');
var ProductCategory = require('./models/productCategory.js');
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
            console.log(err)
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

                    } else {
                        res.json(currentUser);
                    }
                })

            }
        }
    })

}

module.exports.getUser = function (req, res) {

    User.findOne({
        'token': req.body.userToken
    }, '-local.password', function (err, user) {
        if (err) {
            console.log(err);

        } else {
            res.json(user);
        }
    })

}

module.exports.addService = function (req, res) {

    var newService = new Service();

    var token = req.body.userToken + random.generate(15);

    newService = req.body.newServiceData;
    newService.userToken = req.body.userToken;
    newService.token = token;

    newService.save().then(function () {

        User.findOne({
            'token': req.body.userToken
        }, function (err, user) {

            if (err) {
                console.log(err);
            } else {
                user.services.push({
                    serviceToken: token
                });
                user.save().then(function () {
                    res.json('Service Added Successfully');
                }, function (err2) {
                    console.log(err2);
                })
            }

        });

    }, function (err) {
        console.log(err);
    })

}

module.exports.getAllUsers = function (req, res) {

    User.find({}, function (err, allUsers) {
        if (err) {
            console.log(err)
        } else {
            res.json(allUsers);
        }
    })

}

module.exports.getService = function (req, res) {

    Service.findOne({
        'token': req.body.serviceToken
    }, function (err, service) {
        if (err) {
            console.log(err)
        } else {
            User.findOne({
                'token': service.userToken
            }, function (err2, user) {
                if (err2) {
                    console.log(err2);
                } else {
                    var postData = {
                        service: service,
                        serviceOwner: user
                    };
                    res.json(postData);
                }
            })
        }
    })
}

module.exports.getAllServices = function (req, res) {

    var allServices = [];

    Service.find({}, function (err, tempAllServices) {
        if (err) {
            console.log(err);

        }
    }).then(function () {

        tempAllServices.forEach(service => {

            User.findOne({
                'token': service.userToken
            }, function (err, user) {
                if (err) {
                    console.log(err);
                } else {

                    allServices.push({
                        service: service,
                        serviceOwner: user
                    })
                }
            })

        }).then(function () {
            res.json(allServices)
        }, function (err) {
            console.log(err);
        })

    }, function (err) {
        console.log(err);
    })

}

module.exports.addProduct = function (req, res) {

    var newProduct = new Product();
    var token = req.body.userToken + random.generate(10);

    newProduct = req.body.newProductData;
    newProduct.userToken = req.body.userToken;
    newProduct.token = token;

    newProduct.save().then(function () {
        User.findOne({
            'token': req.body.userToken
        }, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                user.products.push({
                    productToken: token
                });

                user.save().then(function () {
                    res.json('Product Added Successfully')
                }, function (err) {
                    console.log(err)
                })
            }
        })

    }, function (err) {
        console.log(err);
    })

}

module.exports.getProduct = function (req, res) {

    Product.findOne({
        'token': req.body.productToken
    }, function (err, product) {
        if (err) {
            console.log(err)
        } else {
            User.findOne({
                'token': product.userToken
            }, function (err2, user) {
                if (err2) {
                    console.log(err2);
                } else {
                    var postData = {
                        product: product,
                        productOwner: user
                    };

                    res.json(postData);
                }
            })
        }
    })

}

module.exports.getAllProducts = function (req, res) {

    var allProducts = [];

    Product.find({}, function (err, tempAllProducts) {
        if (err) {
            console.log(err);
        }
    }).then(function () {
        tempAllProducts.forEach(product => {
            User.findOne({
                'token': product.userToken
            }, function (err, user) {
                if (err) {
                    console.log(err);
                } else {

                    allProducts.push({
                        product: product,
                        productOwner: user
                    })
                }
            })
        }).then(function () {
            res.json(allProducts)
        }, function (err) {
            console.log(err);
        })
    }, function (err) {
        console.log(err);
    })

}

module.exports.Search = function (req, res) {

    var searchResult = {}

    searchResult.users = new [];
    searchResult.services = new [];
    searchResult.products = new [];

    var currentUserToken = req.body.currentUserToken;
    var presentUserLocation = req.body.currentLocation;

    var userParams = {
        $or: [{
                'Name.firstName': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            },
            {
                'Name.lastName': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            },
            {
                'local.email': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            },
            {
                'phoneNumber': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            }
        ],
        $and: [{
            'token': {
                $ne: req.body.currentUserToken
            }
        }]
    }

    var serviceParams = {
        $or: [{
                'Name': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            },
            {
                'Category': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            }
        ],
        $and: [{
            'userToken': {
                $ne: req.body.currentUserToken
            }
        }]
    }

    var productParams = {
        $or: [{
                'Name': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            },
            {
                'Category': {
                    '$regex': req.body.searchString,
                    '$options': 'i'
                }
            }
        ],
        $and: [{
            'userToken': {
                $ne: req.body.currentUserToken
            }
        }]
    }

    User.find(userParams).exec(function (err, userResults) {
        if (err) {
            console.log(err)
        } else {
            searchResult.users = userResults;
        }
    });

    Service.find(serviceParams).exec(function (err, serviceResults) {
        if (err) {
            console.log(err);
        } else {
            searchResult.services = serviceResults;
        }
    });

    Product.find(serviceParams).exec(function (err, productResults) {
        if (err) {
            console.log(err);
        } else {
            searchResult.products = productResults;
        }
    });

}