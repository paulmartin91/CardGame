//dependencies
const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')

//local files
const {User, validate} = require('../models/user')

//express router
const router = express.Router()

//handle requests
router.post('/', async (req, res) => {
  //validate request user using JOI function from users model
  const { error } = validate(req.body)
  //send 400 for invalid req
  if (error) return res.status(400).send(error.details[0].message)
  //check if username exists
  let user = await User.findOne({ username: req.body.username })
  //send 400 for username exists
  if (user) return res.status(400).send('User already exists.')
  //check if email exists
  user = await User.findOne({ email: req.body.email })
  //send 400 for email exists
  if (user) return res.status(400).send('Email already exists.')
  //select only relevant keys
  user = new User({..._.pick(req.body, ['username', 'email', 'password']), isLoggedIn: true})
  //salt pw
  const salt = await bcrypt.genSalt(10)
  //hash pw
  user.password = await bcrypt.hash(user.password, salt)
  //save user to db
  await user.save();
  //generate a jwt
  const token = user.generateAuthToken()
  //send 200 with token for success
  res
    .header('x-auth-token', token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ['_id', 'username', 'email']))
})

//export router
module.exports = router