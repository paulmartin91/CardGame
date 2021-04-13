const handleJoinGameRequest = require('./handleJoinRequest')
const handleCreateGameRequest = require('./handleCreateGameRequest')
// const socketAuth = require('../middleware/auth')
const jwt = require('jsonwebtoken')

const connect = io => {
  //when a user connects to web socket
  
  io.use( async (socket, next)=> {
    const token = await socket.handshake.auth.token
    if (!token) {
      console.log('no token')//return socket.emit('Access denied. No token provided.')
      return
    }
    try {
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
      console.log(decoded.username, 'has connected')
      next()
    } catch (error) {
      console.log(error)
      return
    } 
  })

  io.on('connection', (socket) => {

    //client request to join a game
    handleJoinGameRequest(socket)
    handleCreateGameRequest(socket)

    //when a user disconnects to web socket
    socket.on("disconnect", () => {
      console.log(socket.id, "disconnected");
    });

  });
}

module.exports = connect
