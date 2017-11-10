var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
const hbs = require('hbs');
var handlebars = require('express-handlebars');
var fs = require('fs');
var colors = require('colors');
var mongoose = require ('mongoose');


mongoose.connect('mongodb://localhost:27017/Udemy', {useMongoClient:true},function(err){

  if (err){
    return console.log('Unable to connect to Mongodb' .red);

  } else {

    return console.log('Successfully connect to Mongodb'.green);
  }



});

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
hbs.registerPartials(__dirname + '/views/template');
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'hbs');



app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {

  	if (err){
  		console.log('Unable to append to server.log')
  	}
  });
  next();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

 app.use('/', index);
//app.use('/users', users);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


process.on('SIGINT', function() {
  console.log( '\nGracefully shutting down from SIGINT (Ctrl-C)'.blue);
  // some other closing procedures go here
  process.exit(1);
});

module.exports = app;
