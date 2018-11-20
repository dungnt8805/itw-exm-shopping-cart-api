'use strict';

const cartModel = require('../models/cart');
const productModel = require('../models/product');
const shortid = require('shortid');
const _ = require('lodash');

function get(req, rep) {
	cartModel.findOne({ cartToken: req.params.cartToken }).exec().then(rep).catch(rep);
}


function create(req, rep) {
	const productUrl = req.payload.product;
	const quantity = req.payload.quantity;
	const cartToken = req.params.cartToken;
	if (!quantity) {
		return rep({ error: true });
	}
	const promises = [
		productModel.findOne({ url: productUrl }).exec()
	];
	if (cartToken) {
		promises.push(cartModel.findOne({ cartToken: req.params.cartToken }).exec())
	}
	Promise.all(promises).then(data => {
		const product = data[0];
		if (!product) {
			return rep({ error: true });
		}
		let cart = data[1];
		if (!cart) {
			const price = product.price * quantity;
			cart = { cartToken: shortid.generate(), price, total: price, items: [{ title: product.title, url: productUrl, price: product.price, description: product.description, image: product.image, quantity }] };
			cartModel.create(cart, (err, result) => {
				if (err) {
					return rep({ error: true, err });
				}
				rep(cart);
			});
		} else {
			let addNew = true;
			const items = cart.items;
			const itemsCount = items.length;
			const newPrice = (product.price * quantity) + cart.price;
			const updates = { price: newPrice, total: newPrice };
			for (let i = 0; i < itemsCount; i++) {
				if (items[i].url === productUrl) {
					items[i].quantity = (cart.items[i].quantity + quantity);
					addNew = false;
					break;
				}
			}
			if (addNew) {
				items.push({ title: product.title, url: productUrl, price: product.price, description: product.description, image: product.image, quantity });
			}
			updates.items = items;
			cartModel.update({ cartToken }, { $set: updates }).exec().then(() => rep(updates));
		}
	}).catch(() => rep({ error: true }));
	
}

function update(req, rep) {
	const cartToken = req.params.cartToken;
	const updateItems = req.payload.items;
	cartModel.findOne({ cartToken }).exec().then(cart => {
		if (!cart) {
			return rep({ error: true });
		}
		let newPrice = 0;
		const items = cart.items;
		const newItems = [];
		for (let i = 0; i < updateItems.length; i++) {
			if (updateItems[i].quantity) {
				const item = _.find(items, (obj) => {
					return obj.url === updateItems[i].url;
				});
				if (item) {
					item.quantity = updateItems[i].quantity;
					newPrice += (item.price * updateItems[i].quantity);
					newItems.push(item);
				}
			}
		}
		const updates = { items: newItems, price: newPrice, total: newPrice };
		cartModel.update({ cartToken }, { $set: updates }).exec().then(() => rep(updates));
	}).catch((err) => { rep({ error: true, err }) });
}

module.exports = { get, create, update };