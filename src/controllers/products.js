'use strict';

const productModel = require('../models/product');

function all(req, rep) {
    productModel.find({}).exec().then(products => rep(products)).catch(err => rep({ err }));
}

function get(req, rep) {
    productModel.findOne({ url: req.params.productUrl }).exec().then(rep).catch(rep)
}

module.exports = { all, get};
