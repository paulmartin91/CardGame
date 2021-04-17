const handleJoinGameRequest = require('./handleJoinRequest')
const handleCreateGameRequest = require('./handleCreateGameRequest')
const {handleLeaveGameRequest} = require('./handleLeaveGameRequest')
const handlePlayerListRefresh = require('./handlePlayerListRefresh')
const {socketAuth} = require('../middleware/auth')
const {isInGame} = require('../middleware/isInGame')

const connect = io => {

  //middleware for authenticating users
  io.use(socketAuth)
  //middleware for checking if client is in a game
  io.use(isInGame)

  io.on('connection', (socket) => {

    //client request to join a game
    handleJoinGameRequest(socket)
    //client request to create a game
    handleCreateGameRequest(socket)
    //client request to leave a game
    handleLeaveGameRequest(socket, io)
    //client request to refresh the player list
    handlePlayerListRefresh(socket, io)

    //when a user disconnects to web socket
    socket.on("disconnect", () => {
      console.log(socket.id, "disconnected")
    })

  });
}

module.exports = connect