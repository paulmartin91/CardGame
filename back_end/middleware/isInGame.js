// const { GameList } = require("../models/gameList")
const activeGames = require('../common/games')
const _ = require('lodash')

const isInGame = async (socket, next) => {

  // const toCheck = {...activeGames}

  // _.filter(toCheck, {
  //   players: {sid: socket.user.username}
  // })

  // console.log(toCheck)

  // const checked = Object.keys(toCheck).filter(key => {
  //   if (Object.keys(toCheck[key].players).includes('paul12')) return 'toCheck[key]'
  // })

  const gameName = _.findKey(activeGames, game => Object.keys(game.players).includes(socket.user.username))

  socket.game = activeGames[gameName]

  if (gameName) {
    if (activeGames[gameName].isStarted){
      socket.emit('server_request_leave_game')
    } else {
      //send refresh to all clients
      socket.to(gameName).emit('server_response_playerList_refresh', activeGames[gameName].players);
      //add player to socket room
      socket.join(gameName)
      //redirect user to active game
      socket.emit('server_redirect_user_to_game', _.pick(activeGames[gameName], ['name', 'players']))
    }
  }

  // //inform client they have left game
  // socket.emit('server_request_leave_game')

  next()

  /*
  //look for user in games
  //const game = await GameList.find( { [`players.${socket.user.username}`] : { $exists : true } })
  const game = activeGames.some(game => socket.user.username in game.players)

  socket.game = [...game]

  if (game.length == 1) {
    //send refresh to all clients
    socket.to(game[0].name).emit('server_response_playerList_refresh', game[0].players);
    //add player to socket room
    socket.join(game[0].name)
    //redirect user to active game
    socket.emit('server_redirect_user_to_game', _.pick(game[0], ['name', 'players']))
  }

  //inform client they have left game
  socket.emit('server_request_leave_game')

  next()
  */
}
// const isInGame = async (socket, next) => {
//   //look for user in games
//   const game = await GameList.find( { [`players.${socket.user.username}`] : { $exists : true } })
//   socket.game = [...game]

//   if (game.length == 1) {
//     //send refresh to all clients
//     socket.to(game[0].name).emit('server_response_playerList_refresh', game[0].players);
//     //add player to socket room
//     socket.join(game[0].name)
//     //redirect user to active game
//     socket.emit('server_redirect_user_to_game', _.pick(game[0], ['name', 'players']))
//   }

//   //inform client they have left game
//   socket.emit('server_request_leave_game')

//   next()
// }

exports.isInGame = isInGame