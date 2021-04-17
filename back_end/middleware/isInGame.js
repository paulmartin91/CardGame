const { GameList } = require("../models/gameList")
const _ = require('lodash')

const isInGame = async (socket, next) => {
  //look for user in games
  const game = await GameList.find( { [`players.${socket.user.username}`] : { $exists : true } })
  socket.game = [...game]

  if (game.length == 1) {
    //send refresh to all clients
    socket.to(game[0].name).emit('server_response_playerList_refresh', game[0].players);
    //add player to socket room
    socket.join(game[0].name)
    //redirect user to active game
    socket.emit('server_redirect_user_to_game', _.pick(game[0], ['name', 'players']))
  }

  next()
}

exports.isInGame = isInGame