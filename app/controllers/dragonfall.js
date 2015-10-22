/**
 * Created by modun on 15/6/24.
 */


var express = require('express');
var _ = require('underscore');

var consts = require('../../config/consts');

var router = express.Router();
module.exports = router;

var Config = {
  DevUpdateServer: '54.223.172.65:3000',
  DevGateServer: '54.223.172.65:3011',
  AppleUpdateServer: '54.223.202.136:3000',
  AppleGateServer: '54.223.202.136:3011',
  ReleaseUpdateServer: '54.223.166.65:3000',
  ReleaseGateServer: '54.223.166.65:3011',
  CurrentVersion: '1.1.1',
  AppleVersion: '1.1.2'
};

router.get('/query-entry', function (req, res) {
  var query = req.query;
  var version = query.version;
  var env = query.env;

  if (!_.contains(consts.GameEnv, env))
    return res.json({code: 500, message: "env 不合法"});

  //if (version === Config.AppleVersion) {
  //  return res.json({
  //    code: 200,
  //    data: {updateServer: Config.AppleUpdateServer, gateServer: Config.AppleGateServer}
  //  });
  //}
  //
  //return res.json({
  //  code: 200,
  //  data: {updateServer: Config.DevUpdateServer, gateServer: Config.DevGateServer}
  //});


  if (env === consts.GameEnv.Development) {
    return res.json({
      code: 200,
      data: {updateServer: Config.DevUpdateServer, gateServer: Config.DevGateServer}
    });
  }

  if (env === consts.GameEnv.Production) {
    if (version === Config.CurrentVersion) {
      return res.json({
        code: 200,
        data: {updateServer: Config.ReleaseUpdateServer, gateServer: Config.ReleaseGateServer}
      });
    }
    if (version === Config.AppleVersion) {
      return res.json({
        code: 200,
        data: {updateServer: Config.AppleUpdateServer, gateServer: Config.AppleGateServer}
      });
    }
  }
  res.sendStatus(400);
});
