var express = require('express');
var app = express.Router();
var User = require('../models/users');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
// get home page
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my new website (Ahmed && Asma)'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'My new Projects'
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.post('/insert',(req, res) => {

  var newUser = new User();
  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.password = req.body.password;


  newUser.save().then((doc) => {
    //console.log('user saved', doc);
    res.send(doc);
  },(e) => {

   // console.log('Unable to save user', e);
   res.status(400).send(e);

  });

});


app.get('/select',(req, res) => {
  User.find().then((users) => {
    res.send({users});
  }, (e) => {
   res.status(400).send(e);
  })
});


app.get('/select/:id',(req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  User.findById(id).then((users) => {
      if (!users){
      return res.status(404).send();
    }

      res.send({users});

  }).catch((e) =>{
      res.status(400).send();
  });

});


app.delete('/delete/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  User.findByIdAndRemove(id).then((users) =>{
    if (!users){
      return res.status(404).send

    }

    res.send(users);

  }).catch((e) => {
    res.status(400).send();

  });
});

app.patch('/update/:id', (req, res) => {

  var id = req.params.id;
  var body = _.pick(req.body, ['email','username','password']);

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  if (!_.isString (body.username) && body.username){

    body.username = null;
  }

  User.findByIdAndUpdate(id,{$set:body}, {new:true}).then((users) =>{

    if (!users){
      return res.status(404).send();
    }

    res.send({users});

  }).catch((e) => {

    res.status(400).send();
  });

});

module.exports = app;
