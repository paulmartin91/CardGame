const { GameList } = require('../models/gameList')
const _ = require('lodash')

const leaveGame = async (io, socket, username) => {
  //init error
  const err = new Error('Leave game error')
  if (!socket || !username) {
    err.data = {content: "no username or socket provided"}
    socket.emit('Leave game error', err )
    return false
  }

  //find game
  const game = await GameList.findOne( { [`players.${username}`] : { $exists : true } })

  //if game doesn't exist
  if (!game) {
    err.data = {content: "game doesn't exist"}
    socket.emit('Leave game error', err )
    socket.leave(game.name)
    return true
  }

  const games = await GameList.find( { [`players.${username}`] : { $exists : true } })

  if (!games) return

  games.forEach(async game => {
    //if last player in game, delete game
    if (Object.keys(game.players).length == 1) {
      const test = await GameList.deleteOne({_id: game._id})
    } else { //else remove player from playerlist
        game.players = _.omitBy(game.players, (value, key) => key == username)
        //save game object
        game.save()
    }
    //remove from socket room
    socket.leave(game.name)
    //send refresh to all other clients
    io.in(game.name).emit('server_response_playerList_refresh', game.players)
  })
  return true
}

const handleLeaveGameRequest = (socket, io) => {
  socket.on('client_request_leave_current_game', async () => {
    const success = await leaveGame(io, socket, socket.user.username)  
    if (success) socket.emit("server_response_leave_current_game", true)
  })
} 

module.exports = {
  leaveGame,
  handleLeaveGameRequest
}