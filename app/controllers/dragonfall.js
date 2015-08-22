/**
 * Created by modun on 15/6/24.
 */


var express = require('express');
var _ = require('underscore');

var consts = require('../../config/consts');

var router = express.Router();
module.exports = router;

var Config = {
  DevUrl:'54.223.172.65:3000',
  AppleUrl:'54.223.202.136:3000',
  ReleaseUrl:'54.223.166.65:3000',
  CurrentVersion:'1.01',
  AppleVersion:'1.1.1'
};

router.get('/query-entry', function(req, res){
  var query = req.query;
  var version = query.version;
  var env = query.env;

  if(!_.contains(consts.GameEnv, env)) return res.json({code:500, message:"env 不合法"});
  if(env === consts.GameEnv.Development) return res.json({code:200, data:{url:Config.DevUrl}});
  if(env === consts.GameEnv.Production){
    if(version === Config.CurrentVersion) return res.json({code:200, data:{url:Config.ReleaseUrl}});
    if(version === Config.AppleVersion) return res.json({code:200, data:{url:Config.AppleUrl}});
  }
  res.sendStatus(400);
});
