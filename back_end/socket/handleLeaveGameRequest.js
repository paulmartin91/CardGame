const { GameList } = require('../models/gameList')
const _ = require('lodash')

const handleLeaveGameRequest = socket => {
  socket.on('client request leave current game', async () => {
    const username = socket.user.username
    //find the game the user is in
    const game = await GameList.findOne( { [`players.${username}`] : { $exists : true } })
    //remove player from playerlist
    game.players = _.omitBy(game.players, (value, key) => key == username)
    //save game object
    game.save()
    //remove from socket room
    socket.leave()
    //refresh other players lists
    
    //confirm left with client
    
  })
} 

module.exports = handleLeaveGameRequest