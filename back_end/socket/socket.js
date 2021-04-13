const handleJoinGameRequest = require('./handleJoinRequest')
const handleCreateGameRequest = require('./handleCreateGameRequest')

const connect = io => {
  //when a user connects to web socket
  io.on('connection', (socket) => {
    console.log('a user connected');
    //client request to join a game
    handleJoinGameRequest(socket)
    handleCreateGameRequest(socket)

    socket.on("disconnect", () => {
      console.log(socket.id, "disconnected");
      console.log(io.sockets.adapter.rooms)
    });

  });
}

module.exports = connect
