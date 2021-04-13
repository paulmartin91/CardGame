const { GameList } = require('../models/gameList')
const _ = require('lodash')

const handleJoinGameRequest = socket => {
  socket.on('client request join game', async ({name, user, password}) => {
    //init error object
    let err = new Error('Join game error')
    //check game exists
    let game = await GameList.findOne({ name: name })
    //send error for game not existing
    if (!game) {
      err.data = {content: "Game no longer exists"}
      socket.emit('join error', err )
      return
    }
    //if game is full
    const numberOfPLayers = Object.keys(game.players).length
    if (game.maxPlayers === numberOfPLayers) {
      err.data = {content: "Game is full"}
      socket.emit('join error', err )
      return
    }
    //if password incorrect
    if (game.password && password !== game.password) {
      err.data = {content: "Incorrect Password"}
      socket.emit('join error', err )
      return
    }
    
    //On success...
    //create player object
    const playerObject = {ready: false, playerNumber: numberOfPLayers}
    //add player object to gameList document
    game.players = {...game.players, [user.username]: playerObject}
    //save document
    game.save()
    //add player to socket room
    socket.join(name)
    //send success
    socket.emit('server response join game', _.pick(game, ['name', 'players'] ))
  })
} 

module.exports = handleJoinGameRequest