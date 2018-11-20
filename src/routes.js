'use strict';

const productCtrl = require('./controllers/products');
const cartCtrl = require('./controllers/carts');
const Joi = require('joi');

module.exports = [
    {
        method: 'GET', path: '/products', handler: productCtrl.all,
    },
    {
        method: 'GET', path: '/products/{productUrl}', handler: productCtrl.get,
    },
    {
    	method: 'GET', path: '/cart/{cartToken}', handler: cartCtrl.get,
    	config: {
    		validate: {
	    		params: {
	    			cartToken: Joi.string().required(),
	    		},
	    	},
    	},
    },
    {
    	method: 'POST', path: '/cart/{cartToken?}', handler: cartCtrl.create,
    	config: {
    		validate: {
    			payload: {
	    			product: Joi.string().required(),
	    			quantity: Joi.number().required(),
    			},
    		},
    	}
    },
    {
    	method: 'PATCH', path: '/cart/{cartToken}', handler: cartCtrl.update,
    	config: {
    		validate: {
                params: {
                    cartToken: Joi.string().required(),
                },
    			payload: {
                    items: Joi.array().items(Joi.object().keys({
                        product: Joi.string().required(),
                        quantity: Joi.number().required(),
                    }))
    			},
    		},
    	}
    },
];