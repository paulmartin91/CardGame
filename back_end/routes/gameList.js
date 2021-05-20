//dependencies
const mongoose = require('mongoose')
const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')

//local files
const { GameList } = require('../models/gameList')
const {auth} = require('../middleware/auth')

//express router
const router = express.Router()

//handle get request
router.get('/', auth, async (req, res) => {
  //get gameList from db
  let gameList = await GameList.find()
  //hide passwords
  _(gameList).forEach(game => {if (game.password) game.password = true})
  //send game object on success
  res.send(gameList)
})

//export router
module.exports = router