const _ = require('lodash')
const getTime = require('../common/getTime')

module.exports = function handleMessageRequest(socket, io){
  socket.on('client_request_send_message', async message => {
    io.to(socket.game[0].name).emit('server_response_send_message', {
      message: message,
      username: socket.user.username,
      time: getTime(),
    })
  })
}