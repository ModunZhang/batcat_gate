/**
 * Created by modun on 15/6/24.
 */


var express = require('express');
var _ = require('underscore');
var fs = require('fs');

var consts = require('../../config/consts');

var router = express.Router();
module.exports = router;

var Entry = {
  ios: {
    development: 'df.dev.ios.batcatstudio.com:13100',
    production: 'df.prod.ios.batcatstudio.com:13130'
  },
  android: {
    development: '114.55.85.67:13110'
  },
  wp: {
    development: '114.55.85.67:13120',
    hotfix: '114.55.85.67:13120',
    production: '47.88.78.13:13100'
  }
};

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
 * @param env
 * @returns {*}
 */
var GetVersionData = function (platform, env) {
  var path = __dirname + '/../../public/update/dragonfall/' + platform + '/' + env + '/res/version.json';
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
var GetNoticeData = function (platform, env) {
  var path = __dirname + '/../../public/update/dragonfall/' + platform + '/' + env + '/notice.txt';
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
  var env = query.env;
  var platform = query.platform;
  if (!_.contains(consts.GameEnv, env)) {
    return res.json({code: 500, message: "env 不合法"});
  }
  if (!_.contains(consts.PlatForm, platform)) {
    return res.json({code: 500, message: "platform 不合法"});
  }
  if (!CheckVersion(version)) {
    return res.json({code: 500, message: "version 不合法"});
  }

  var basePath = '/update/dragonfall/' + platform;
  var entry = null;
  var versionData = GetVersionData(platform, env);
  if (!versionData) {
    return res.json({code: 500, message: "版本文件丢失"});
  }
  if (version > versionData.appVersion) {
    versionData = GetVersionData(platform, 'hotfix');
    basePath += "/hotfix";
    entry = Entry[platform]['hotfix'];
  } else {
    basePath += '/' + env;
    entry = Entry[platform][env];
  }
  if (!entry) {
    return res.json({code: 500, message: "version 不合法"});
  }
  versionData.basePath = basePath;
  versionData.entry = entry;
  return res.json({
    code: 200,
    data: versionData
  });
});

/**
 * 获取公告
 */
router.get('/get-notice', function (req, res) {
  var query = req.query;
  var env = query.env;
  var platform = query.platform;
  if (!env) env = 'production';
  if (!platform) platform = 'ios';

  if (!_.contains(consts.GameEnv, env)) {
    return res.json({code: 500, message: "env 不合法"});
  }
  if (!_.contains(consts.PlatForm, platform)) {
    return res.json({code: 500, message: "platform 不合法"});
  }

  var notice = GetNoticeData(platform, env);
  return res.json({
    code: 200,
    data: notice
  });
});