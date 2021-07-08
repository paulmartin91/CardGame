//const { GameList } = require('../models/gameList')
const _ = require('lodash')

const { returnCards } = require('../common/cards')
const activeGames = require('../common/games')
const getTime = require('../common/getTime')

const leaveGame = async (io, socket, username) => {
  //init error
  const err = new Error('Leave game error')
  if (!socket || !username) {
    err.data = {content: "no username or socket provided"}
    socket.emit('Leave game error', err )
    return false
  }

  //find game
  //const game = await GameList.findOne( { [`players.${username}`] : { $exists : true } })
  const gameName = _.findKey(activeGames, game => Object.keys(game.players).includes(socket.user.username))

  // if game doesn't exist
  if (!gameName) {
    return true
  }

  //if last player in game, delete game
  if (Object.keys(activeGames[gameName].players).length == 1) {
    delete activeGames[gameName]
  } else {
    //else remove player from playerlist
    activeGames[gameName].players = _.omitBy(activeGames[gameName].players, (value, key) => key == username)
    //remove from socket room
    socket.leave(gameName)

    //if game has started, return players hands to deck
    if (activeGames[gameName].isStarted) {
      console.log('tried to leave game')
      console.log(activeGames[gameName].lastKnownHands)

      //make new arr with selected cards
      let cardsToReturn = [
        ...activeGames[gameName].lastKnownHands[username].blind,
        ...activeGames[gameName].lastKnownHands[username].open,
      ]

      //ignore request if nothing is selected
      if (cardsToReturn.length >= 1) {

        //unselect all selected cards
        cardsToReturn.forEach(card => card.selected = false)

        //return cards to deck
        returnCards(gameName, cardsToReturn)

        //delete player from activeGames
      }
    }
    
    //send message to game that player has left
    io.in(gameName).emit('server_response_send_message', {
      message: `${username} has left the game`,
      username: "Server",
      time: getTime()
    })

    if (activeGames[gameName].isStarted) {
      io.in(gameName).emit('player_left', {
        username,
        playerList: activeGames[gameName].players
      })
    } else {
      //refresh playerlist
      io.in(gameName).emit('server_response_playerList_refresh', {playerList: activeGames[gameName].players})
    }




  }

  return true


}

const handleLeaveGameRequest = (socket, io) => {
  socket.on('client_request_leave_current_game', async () => {
    const success = await leaveGame(io, socket, socket.user.username)  
    if (success) {
      socket.emit("server_response_leave_current_game", true)
    }
  })
} 

module.exports = {
  leaveGame,
  handleLeaveGameRequest
}