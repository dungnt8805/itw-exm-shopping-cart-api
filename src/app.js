'use strict';

const Hapi = require('hapi');
const debug = require('debug');
const conf = require('./conf/settings');
const routes = require('./routes');
const server = new Hapi.Server(conf.get('hapi:conf'));

server.connection({ port: process.env.PORT || 8080, routes: { cors: true } });
server.route(routes);

module.exports = server;
