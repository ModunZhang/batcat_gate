var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var swig = require('swig');
var _ = require('underscore');

var env = process.env.NODE_ENV || 'development';

var app = express();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'app/views'));
app.set('view cache', false);
if(env === 'development'){
  swig.setDefaults({cache:false});
}
app.use(favicon(__dirname + '/public/images/batcat_icon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride(function(req){
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(cookieParser());

require('./config/routes')(app);


module.exports = app;
