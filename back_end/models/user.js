//dependencies
const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

//user db schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isLoggedIn: {
    type: Boolean,
    required: true
  }
})

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, username: this.username }, process.env.JWTPRIVATEKEY)
  return token
}

//init schema class
const User = mongoose.model('User', userSchema);

//JOI validation model for registration
const validateUser = user => {
  const schema = Joi.object({
    username: Joi.string().min(5).required(20),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  })

  return schema.validate(user)
}

//export funcs
exports.User = User
exports.validate = validateUser