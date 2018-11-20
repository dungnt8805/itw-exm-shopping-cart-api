'use strict';
const productModel = require('../models/product')
const products = require('../assets/product.json');

function productSeed() {
    productModel.count({}, (err, count) => {
        if (err) {
            return;
        }
        if (count) {
            return
        }
        productModel.insertMany(products);
    })
}

exports.productSeed = productSeed;