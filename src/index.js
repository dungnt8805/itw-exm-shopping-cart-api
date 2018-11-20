'use strict';

const debug = require('debug');
const conf = require('./conf/settings');
const dbAdapter = require('./helpers/db_adapter');
const seeds = require('./services/product_seed');
const app = require('./app');

app.start(() => {
    dbAdapter.connect(conf.get('database'));
    seeds.productSeed();
    debug('Server running at:', app.info.uri);
});
