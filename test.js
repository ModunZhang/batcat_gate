/**
 * Created by modun on 2017/6/11.
 */

const MongoClient = require('mongodb').MongoClient;


const DBUrl = 'mongodb://modun:Zxm75504109@47.88.35.31:27017/dragonfall-scmobile-wp?authSource=admin';
let db = null;
function getDB() {
    return new Promise((resolve, reject) => {
        if (db && db.serverConfig.isConnected()) return resolve(db);
        MongoClient.connect(DBUrl, (err, _db) => {
            if (err) return reject(err);
            console.log('db opened');
            db = _db;
            db.on('close', () => {
                console.log('db closed');
                db = null;
            });
            db.on('timeout', (e) => {
                console.error(e);
                closeDB();
            });
            db.on('error', (e) => {
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
    return getDB().then((db) => {
        const collection = db.collection('devices');
        return collection.find({_id: deviceId}).count();
    }).then((count) => {
        return Promise.resolve(count > 0);
    })
}

isDeviceExist('1f495b828e7823f5d7644fff141a8918').then((exist) => {
    console.log(exist);
    return isDeviceExist('fadb588e0617f93ccc59d0cfd3407485');
}).then((exist) => {
    console.log(exist);
    return isDeviceExist('fadb588e0617f93ccc59d0cfd3407481');
}).then((exist) => {
    console.log(exist);
    return closeDB();
}).then(() => {
    return isDeviceExist('fadb588e0617f93ccc59d0cfd3407481');
}).then((exist) => {
    console.log(exist);
    closeDB();
});

