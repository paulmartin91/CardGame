//const { GameList } = require('../models/gameList')
const activeGames = require('../common/games')
const _ = require('lodash')
const getTime = require('../common/getTime')

const handleJoinGameRequest = socket => {
  socket.on('client request join game', async ({name, user, password}) => {
    //init error object
    let err = new Error('Join game error')
    //check game exists
    //let game = await GameList.findOne({ name: name })
    let game = name in activeGames && activeGames[name]
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
    const playerObject = {ready: false, playerNumber: numberOfPLayers, sid: socket.id}
    //add player object to gameList document
    game.players = {...game.players, [user.username]: playerObject}
    //save game to socket obj
    socket.game = game
    //save document
    // game.save()
    activeGames[name] = game
    //add player to socket room
    socket.join(name)
    //send success to client
    socket.emit('server response join game', {name, ..._.pick(game, ['players'] )})
    //send refresh to all clients
    socket.to(name).emit('server_response_playerList_refresh', game.players);
    //send message to game that player has left
    socket.to(name).emit('server_response_send_message', {
      message: `${user.username} has joined the game`,
      username: "Server",
      time: getTime()
    })
    // console.log(socket.rooms)

  })
} 
// const handleJoinGameRequest = socket => {
//   socket.on('client request join game', async ({name, user, password}) => {
//     //init error object
//     let err = new Error('Join game error')
//     //check game exists
//     let game = await GameList.findOne({ name: name })
//     //send error for game not existing
//     if (!game) {
//       err.data = {content: "Game no longer exists"}
//       socket.emit('join error', err )
//       return
//     }
//     //if game is full
//     const numberOfPLayers = Object.keys(game.players).length
//     if (game.maxPlayers === numberOfPLayers) {
//       err.data = {content: "Game is full"}
//       socket.emit('join error', err )
//       return
//     }
//     //if password incorrect
//     if (game.password && password !== game.password) {
//       err.data = {content: "Incorrect Password"}
//       socket.emit('join error', err )
//       return
//     }
    
//     //On success...
//     //create player object
//     const playerObject = {ready: false, playerNumber: numberOfPLayers, sid: socket.id}
//     //add player object to gameList document
//     game.players = {...game.players, [user.username]: playerObject}
//     //save game to socket obj
//     socket.game = [game]
//     //save document
//     game.save()
//     //add player to socket room
//     socket.join(name)
//     //send success to client
//     socket.emit('server response join game', _.pick(game, ['name', 'players'] ))
//     //send refresh to all clients
//     socket.to(name).emit('server_response_playerList_refresh', game.players);

//     // console.log(socket.rooms)

//   })
// } 

module.exports = handleJoinGameRequest