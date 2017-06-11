/**
 * Created by modun on 2017/6/11.
 */

const MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');

const DBUrl = 'mongodb://modun:Zxm75504109@47.88.35.31:27017/dragonfall-scmobile-wp?authSource=admin';
var db = null;
function getDB() {
    return new Promise(function (resolve, reject) {
        if (db && db.serverConfig.isConnected()) return resolve(db);
        MongoClient.connect(DBUrl, function (err, _db) {
            if (err) return reject(err);
            console.log('db opened');
            db = _db;
            db.on('close', function () {
                console.log('db closed');
                db = null;
            });
            db.on('timeout', function (e) {
                console.error(e);
                closeDB();
            });
            db.on('error', function (e) {
                console.error(e);
                closeDB();
            });
            resolve(db);
        })
    })
}

function closeDB() {
    try {
        db.close();
    } finally {
        db = null;
    }
    return Promise.resolve();
}

function isDeviceExist(deviceId) {
    return getDB().then(function (db) {
        const collection = db.collection('devices');
        return collection.find({_id: deviceId}).count();
    }).then(function (count) {
        return Promise.resolve(count > 0);
    })
}

isDeviceExist('1f495b828e7823f5d7644fff141a8918').then(function (exist) {
    console.log(exist);
    return isDeviceExist('fadb588e0617f93ccc59d0cfd3407485');
}).then(function (exist) {
    console.log(exist);
    return isDeviceExist('fadb588e0617f93ccc59d0cfd3407481');
}).then(function (exist) {
    console.log(exist);
    return closeDB();
}).then(function () {
    return isDeviceExist('fadb588e0617f93ccc59d0cfd3407481');
}).then(function (exist) {
    console.log(exist);
    closeDB();
});

