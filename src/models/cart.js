'use strict';

const dbAdapter = require('../helpers/db_adapter');

const cartSchema = dbAdapter.registerSchema({
    cartToken: { type: String, index: true, unique: true },
    items: { type: Array },
    price: { type: Number },
    discount: { type: Number },
    discountCode: { type: String },
    total: { type: Number },
});

const model = dbAdapter.registerModel('carts', cartSchema);
module.exports = model;