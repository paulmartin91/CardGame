// //dependencies
const express = require('express')
const _ = require('lodash')

// //local files
const activeGames = require('../common/games')
const {auth} = require('../middleware/auth')

// //express router
const router = express.Router()

// //handle get request
router.get('/', auth, async (req, res) => {
  const newList = Object.keys(activeGames).map(name => {
    return {
      name: name,
      maxPlayers: activeGames[name].maxPlayers,
      password: activeGames[name].password && true,
      players: activeGames[name].players
    }

  })

  res.send(newList)
})

module.exports = router