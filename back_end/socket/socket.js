const connect = io => {
  //when a user connects to web socket
  io.on('connection', (socket) => {
    console.log('a user connected');
    //client request to join a game
    socket.on('client request join game', ({name, user}) => {
      //add client to room
      console.log(name, user)
      //socket.join(name)
    })
  });
}

module.exports = connect