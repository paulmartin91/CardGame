const handleJoinGameRequest = require('./handleJoinRequest')
const handleCreateGameRequest = require('./handleCreateGameRequest')
const {handleLeaveGameRequest, leaveGame} = require('./handleLeaveGameRequest')
const handlePlayerListRefresh = require('./handlePlayerListRefresh')
const handleMessageRequest = require('./handleMessageRequest')
const {socketAuth} = require('../middleware/auth')
const {isInGame} = require('../middleware/isInGame')
const { handleReadyRequest, handleStartRequest } = require('./handleReadyRequest')
const { handleLogout, logoutAllUsers } = require('./logout')
const {handleDealRequest, handlePlayCardsRequest, handleReturnCardRequest, handleShuffleDeckRequest} = require('./handleCardsRequest')

const activeGames = require('../common/games')

const connect = io => {

  logoutAllUsers(io)

  //middleware for authenticating users
  io.use(socketAuth)
  //middleware for checking if client is in a game
  io.use(isInGame)

  io.on('connection', (socket) => {

    //FOR DEVELOPMENT
    socket.join('paulsgame')

    //client request to join a game
    handleJoinGameRequest(socket)
    //client request to create a game
    handleCreateGameRequest(socket)
    //client request to leave a game
    handleLeaveGameRequest(socket, io)
    //client request to refresh the player list
    handlePlayerListRefresh(socket, io)
    //client request to ready/unready
    handleReadyRequest(socket, io)
    //client request to send message
    handleMessageRequest(socket, io)
    //client request to start a game
    handleStartRequest(socket, io)
    //client request deal cards
    handleDealRequest(socket, io)
    //client request play cards
    handlePlayCardsRequest(socket, io)
    //Client request to return cards to the deck
    handleReturnCardRequest(socket, io)
    //Client request to shuffle deck
    handleShuffleDeckRequest(socket, io)

    //for client side testing of server
    socket.on('client_request_test', () => console.log(activeGames.paulsgame.lastKnownHands))

    //when a user disconnects to web socket
    socket.on('client_request_disconnect_reason', reason => {
      reason == 'logged_out' && handleLogout(socket.user.username)
    })

    socket.on("disconnect", reason => {
      //console.log(socket.id, "disconnected", `token = ${socket.handshake.auth.token}`)
      console.log(socket.id, "disconnected", reason)
      //leave game
      leaveGame(io, socket, socket.user.username)
    })

  });

}

module.exports = connect