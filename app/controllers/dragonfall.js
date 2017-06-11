/**
 * Created by modun on 15/6/24.
 */


var express = require('express');
var _ = require('underscore');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');

var consts = require('../../config/consts');

var router = express.Router();
module.exports = router;

var Entry = {
    wp: '47.88.78.13:13100',
    wp2: '47.88.76.245:13100'
};

const DBUrl = 'mongodb://modun:Zxm75504109@10.24.138.234:27017/dragonfall-scmobile-wp?authSource=admin';
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

/**
 * Check Version
 * @param version
 * @returns {boolean}
 */
var CheckVersion = function (version) {
    if (!version || !_.isString(version) || version.trim().length === 0) return false;
    var versions = version.split('.');
    if (versions.length !== 3) return false;
    for (var i = 0; i < versions.length; i++) {
        var v = parseInt(versions[i]);
        if (!_.isNumber(v) || v < 0) {
            return false
        }
    }
    return true;
};

/**
 * 获取版本数据
 * @param platform
 * @returns {*}
 */
var GetVersionData = function (platform) {
    var path = __dirname + '/../../public/update/dragonfall/' + platform + '/production/res/version.json';
    try {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (e) {
        return null;
    }
};


/**
 * 获取公告
 * @returns {*}
 */
var GetNoticeData = function (platform) {
    var path = __dirname + '/../../public/update/dragonfall/' + platform + '/production/notice.txt';
    try {
        return fs.readFileSync(path, 'utf8');
    } catch (e) {
        return '';
    }
};

/**
 * 版本检查
 */
router.get('/check-version', function (req, res) {
    var query = req.query;
    var version = query.version;
    var platform = 'wp';
    if (!CheckVersion(version)) {
        return res.json({code: 500, message: "version 不合法"});
    }

    const deviceId = query.deviceId;
    (function checkDeviceExist() {
        if (deviceId) {
            return isDeviceExist(deviceId)
        } else {
            return Promise.resolve(true);
        }
    })().then(function (exist) {
        var entry = exist ? Entry['wp'] : Entry['wp2'];
        var basePath = '/update/dragonfall/' + platform;
        var versionData = GetVersionData(platform);
        if (!versionData) {
            return res.json({code: 500, message: "版本文件丢失"});
        }
        if (!entry) {
            return res.json({code: 500, message: "version 不合法"});
        }
        versionData.basePath = basePath;
        versionData.entry = entry;
        versionData.notice = GetNoticeData(platform);
        return res.json({
            code: 200,
            data: versionData
        });
    });
});

/**
 * 获取公告
 */
router.get('/get-notice', function (req, res) {
    return res.json({
        code: 200,
        data: GetNoticeData('wp')
    });
});