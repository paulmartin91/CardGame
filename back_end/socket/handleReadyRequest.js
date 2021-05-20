const { GameList } = require('../models/gameList')
const _ = require('lodash')

function handleReadyRequest(socket, io){
  socket.on('client_request_ready', async () => {
    //set game name
    const gameName = socket.game[0].name
    //set username
    const username = socket.user.username
    //find game
    const game = await GameList.findOne({name: gameName})
    //switch player ready status
    game.players[username].ready = !game.players[username].ready
    //make sure change is registered
    game.markModified('players')
    //save game
    game.save()
    //count players that are ready
    let playerReady = 0
    Object.keys(game.players).forEach(player => game.players[player].ready && playerReady++)
    //if all players are ready, emit that everyone that is ready
    io.in(gameName).emit('server_request_all_ready', playerReady == Object.keys(game.players).length)
    //refresh game for players
    io.in(gameName).emit('server_response_playerList_refresh', game.players)
  })
}

function handleStartRequest(socket, io) {
  socket.on('client_request_start_game', async () => {
    //set game name
    const gameName = socket.game[0].name
    //set username
    const username = socket.user.username
    //find game
    const game = await GameList.findOne({name: gameName})
    //count players that are ready
    let playerReady = 0
    Object.keys(game.players).forEach(player => game.players[player].ready && playerReady++)
    //if all players aren't ready
    if (!playerReady == Object.keys(game.players).length) socket.emit('server_request_all_ready', false)
    //else send start to room
    io.in(gameName).emit('server_request_start')
  })
}

module.exports = {
  handleReadyRequest,
  handleStartRequest
}