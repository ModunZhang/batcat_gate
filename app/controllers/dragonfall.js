/**
 * Created by modun on 15/6/24.
 */


var express = require('express');
var _ = require('underscore');

var consts = require('../../config/consts');

var router = express.Router();
module.exports = router;

var Version = {
  CurrentVersion: '1.1.1',
  AppleVersion: '1.1.2'
};
var Entry = {
  ios: {
    development: {
      updateServer: '54.223.172.65:3000',
      gateServer: '52.69.0.58'
    },
    hotfix: {
      updateServer: '54.223.202.136:3000',
      gateServer: '54.223.202.136:13100'
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
    }
  }
};

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