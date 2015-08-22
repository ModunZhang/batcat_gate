/**
 * Created by modun on 15/6/27.
 */

var dragonfall = require('../app/controllers/dragonfall');

module.exports = function(app){
  app.use('/dragonfall', dragonfall);
};