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
    development: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.172.65:13100'
    },
    hotfix: {
      updateServer: '52.69.0.58:3000',
      gateServer: '52.69.0.58:3011'
    },
    production: {
      updateServer: '54.223.166.65:3000',
      gateServer: '54.223.166.65:3011'
    }
  },
  wp: {
    development: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.75.61:13100'
    },
    hotfix: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.75.61:13100'
    },
    production: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.75.61:13100'
    }
  },
  android: {
    development: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.75.61:13100'
    },
    hotfix: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.75.61:13100'
    },
    production: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.75.61:13100'
    }
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
var GetVersionData = function(platform, env){
  var path = __dirname + '/../../public/update/dragonfall/' + platform + '/' + env + '/res/version.json';
  return JSON.parse(fs.readFileSync(path, 'utf8'));
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
  if(version > versionData.appVersion){
    versionData = GetVersionData(platform, 'hotfix');
    basePath += "/hotfix";
    entry = Entry[platform]['hotfix'];
  }else{
    basePath += '/' + env;
    entry = Entry[platform][env];
  }
  versionData.basePath = basePath;
  versionData.entry = entry.gateServer;
  return res.json({
    code: 200,
    data: versionData
  });
});

/**
 * 获取入口网关
 */
router.get('/query-entry', function (req, res) {
  var query = req.query;
  var version = query.version;
  var env = query.env;
  var platform = query.platform;

  if (!_.contains(consts.GameEnv, env)) {
    return res.json({code: 500, message: "env 不合法"});
  }

  if (!!platform && platform === consts.PlatForm.Wp) {
    return res.json({
      code: 200,
      data: Entry.wp.development
    });
  }

  if (env === consts.GameEnv.Development) {
    return res.json({
      code: 200,
      data: Entry.ios.development
    });
  }

  if (env === consts.GameEnv.Production) {
    return res.json({
      code: 200,
      data: Entry.ios.production
    });
  }

  res.sendStatus(400);
});