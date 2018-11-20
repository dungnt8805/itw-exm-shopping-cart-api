'use strict';

const dbAdapter = require('../helpers/db_adapter');
const productSchema = dbAdapter.registerSchema({
    title: { type: String },
    url: { type: String, index: true, unique: true },
    price: { type: Number },
    description: { type: String },
    image: { type: String },
});

const model = dbAdapter.registerModel('products', productSchema);
module.exports = model;
