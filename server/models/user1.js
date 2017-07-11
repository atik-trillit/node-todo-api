const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema=new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON=function(){
  var user =this;
  var userObject=user.toObject();

  return _.pick(userObject,['id','email']);
}

UserSchema.statics.findByToken=function(token){
  var User =this;
  var decoded;
  try{
    decoded=jwt.verify(token,'abc123');
  }catch(e){

    return new Promise.reject();

  }

  return User.findOne({
    '_id':docoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });
}

UserSchema.methods.generateAuthToken=function(){
  var user =this;
  var access='auth';
  var token=jwt.sign({
    _id:user._id.toHexString(),
    access
  },'abc123').toString();

  user.token.push({
    access,
    token
  });
}
