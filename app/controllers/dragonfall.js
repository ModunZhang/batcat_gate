/**
 * Created by modun on 15/6/24.
 */


var express = require('express');
var _ = require('underscore');

var consts = require('../../config/consts');

var router = express.Router();
module.exports = router;

var Version = '1.1.1';
var Entry = {
  ios: {
    development: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.172.65:13100'
    },
    hotfix: {
      updateServer: '54.223.166.65:3000',
      gateServer: '54.223.166.65:3011'
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
  if (version > Version) {
    basePath += "/hotfix";
    entry = Entry[platform]['hotfix'];
  } else {
    basePath += '/' + env;
    entry = Entry[platform][env];
  }
  var filePath = req.app.get('base') + '/public/' + basePath + '/res/version.json';
  var data = require(filePath);
  data.basePath = basePath;
  data.entry = entry.gateServer;
  return res.json({
    code: 200,
    data: data
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