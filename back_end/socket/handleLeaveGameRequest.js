//const { GameList } = require('../models/gameList')
const activeGames = require('../common/games')

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
  //const game = await GameList.findOne( { [`players.${username}`] : { $exists : true } })
  const gameName = _.findKey(activeGames, game => Object.keys(game.players).includes(socket.user.username))

  // if game doesn't exist
  if (!gameName) {
    return true
  }

  //if last player in game, delete game
  if (Object.keys(activeGames[gameName].players).length == 1) {
    delete activeGames[gameName]
  } else {
    //else remove player from playerlist
    activeGames[gameName].players = _.omitBy(activeGames[gameName].players, (value, key) => key == username)
    //remove from socket room
    socket.leave(gameName)
    //send refresh to all other clients
    io.in(gameName).emit('server_response_playerList_refresh', activeGames[gameName].players)
  }

  return true


}

const handleLeaveGameRequest = (socket, io) => {
  socket.on('client_request_leave_current_game', async () => {
    const success = await leaveGame(io, socket, socket.user.username)  
    if (success) {
      socket.emit("server_response_leave_current_game", true)
    }
  })
} 

module.exports = {
  leaveGame,
  handleLeaveGameRequest
}