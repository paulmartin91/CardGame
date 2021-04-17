const { GameList } = require('../models/gameList')

module.exports = function handlePlayerListRefresh(socket){
  socket.on('client_request_playerList_refresh', async (gameName) => {
    console.log("gamename = ", gameName)
    const {players} = await GameList.findOne({name: gameName})
    socket.emit('server_response_playerList_refresh', players)
  })
}