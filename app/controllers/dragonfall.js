/**
 * Created by modun on 15/6/24.
 */


var express = require('express');
var _ = require('underscore');

var consts = require('../../config/consts');

var router = express.Router();
module.exports = router;

var Config = {
  ios: {
    development: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.172.65:3011'
    },
    hotfix: {
      updateServer: '54.223.202.136:3000',
      gateServer: '54.223.202.136:3011'
    },
    production: {
      updateServer: '54.223.166.65:3000',
      gateServer: '54.223.166.65:3011'
    }
  },
  wp: {
    development: {
      updateServer: '54.223.172.65:3000',
      gateServer: '54.223.75.61:3011'
    }
  },
  CurrentVersion: '1.1.1',
  AppleVersion: '1.1.2'
};

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
      data: Config.wp.development
    });
  }

  if (env === consts.GameEnv.Development) {
    return res.json({
      code: 200,
      data: Config.ios.development
    });
  }

  if (env === consts.GameEnv.Production) {
    return res.json({
      code: 200,
      data: Config.ios.production
    });
  }

  res.sendStatus(400);
});
