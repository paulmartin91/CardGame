//dependencies
const mongoose = require('mongoose')
const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')

//local files
const { GameList } = require('../models/gameList')
const auth = require('../middleware/auth')

//express router
const router = express.Router()

// //handle create game req
// router.post('/create', auth, async (req, res) => {
//   //validate req from local func
//   const { error } = validate(req.body)
//   //send 400 for bad req
//   if (error) return res.status(400).send(error.details[0].message)
//   //check if name exists on db
//   let game = await GameList.findOne({ name: req.body.name })
//   //send 400 for game existing
//   if (game) return res.status(400).send('Game name already exists')
//   //select only relevant keys and create db document
//   game = new GameList(_.pick(req.body, ['name', 'players', 'password', 'maxPlayers']))
//   //save db document
//   await game.save();
//   //send game object on success
//   res.send(true)
// })


// //handle join game req
// router.post('/join', auth, async (req, res) => {
//   //check if name exists on db
//   let game = await GameList.findOne({ name: req.body.name })
//   //send 400 for game existing
//   if (!game) return res.status(400).send('Game no longer exists')
//   //select only relevant keys and create db document
//   if (game.maxPlayers === Object.keys(game.players).length) return res.status(400).send('Game is full')
//   //send game object on success
//   if (game.password && req.body.password !== game.password) return res.status(400).send('Incorrect password')
  
//   //On success
//   res.send(_.pick(game, ['name', 'players']))
// })


//handle get request
router.get('/', auth, async (req, res) => {
  //get gameList from db
  let gameList = await GameList.find()
  //hide passwords
  _(gameList).forEach(game => {if (game.password) game.password = true})
  //send game object on success
  res.send(gameList)
})

// const validate = req => {
//   const schema = Joi.object({
//     name: Joi.string().min(5).max(255).required(),
//     password: Joi.string().min(5).max(1024),
//     players: Joi.object().required(),
//     maxPlayers: Joi.number().min(2).max(6).required(),
//   })

//   return schema.validate(req)
// }

//export router
module.exports = router