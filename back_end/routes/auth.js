//dependencies
const mongoose = require('mongoose')
const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')

//local files
const { User } = require('../models/user')

//express router
const router = express.Router()

//handle login req
router.post('/', async (req, res) => {
  //validate req from local func
  const { error } = validate(req.body)
  //send 400 for bad req
  if (error) return res.status(400).send(error.details[0].message)
  //check if user exists on db
  let user = await User.findOne({ username: req.body.username })
  //send vague 400 for user not existing
  if (!user) return res.status(400).send('Invalid username or password')
  //check if user is logged in
  if (user.isLoggedIn) return res.status(400).send('User already logged in')
  //compare pws
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  //send vague 400 for invalid pw
  if (!validPassword) return res.status(400).send('Invalid username or password')
  //generate an jwt token for the client
  const token = user.generateAuthToken()
  //set login status
  await User.findOneAndUpdate({ username: req.body.username }, {isLoggedIn: true})
  //send 200 for success
  res.send(token)
})

const validate = req => {
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
  })

  return schema.validate(req)
}

//export router
module.exports = router