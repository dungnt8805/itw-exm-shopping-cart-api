'use strict';

const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const debug = require('debug');
let database = null;

function connect(dbConfig) {
    if (!dbConfig.usingNativeClient) {
        return connectByMongoose(dbConfig);
    }
}

function connectByMongoose(dbConf) {
    const { url } = dbConf;
    const options = dbConf.options || {
        server: {
            socketOptions: {
                connectTimeoutMS: 30000,
                socketTimeoutMS: 30000,
                poolSize: 20,
            },
        },
    };
    Mongoose.connect(`mongodb://${url}`, options);
    database = Mongoose.connection;
    database.on('error', () => debug('Connection error'));
    database.once('open', () => debug('Connection with database succeeded.'));
}

function registerSchema(properties, timestamps = true) {
    return new Schema(properties, { timestamps });
}

function registerModel(table, schema) {
    schema.statics.paginate = paginate;

    function paginate(conditions, page, pageSize, sort) {
        return new Promise((resolve, reject) => {
            this.count(conditions, (countErr, total) => {
                if (countErr) {
                    return reject(countErr);
                }
                this.find(conditions).limit(pageSize).skip(pageSize * (page - 1)).sort(sort)
                    .lean().exec((err, docs) => {
                        if (err) {
                            return reject(err);
                        }
                        const res = {
                            docs, page, pageSize, total, totalPage: Math.ceil(total / pageSize),
                        };
                        resolve(res);
                    });
            }, reject);
        });
    }
    return Mongoose.model(table, schema);
}

exports.database = database;
exports.Mongoose = Mongoose;
exports.Schema = Schema;
exports.connect = connect;
exports.registerModel = registerModel;
exports.registerSchema = registerSchema;
