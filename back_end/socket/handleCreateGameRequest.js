//handle create game req
const { GameList } = require('../models/gameList')
const _ = require('lodash')
const Joi = require('joi')
const { gameDecks, deck, assignCardId } = require('../common/cards')

const handleCreateGameRequest = socket => {
  socket.on('client request create game', async (request) => {

    console.log(request)

    const {name, user, password, maxPlayers} = request

    //init error object
    let err = new Error('Join game error')

    //validate req from local func
    const { error } = validate(request)

    //send 400 for bad req
    if (error) {
      err.data = {content: error.details[0].message}
      socket.emit('create error', err )
      return
    }

    // //check game exists
    let game = await GameList.findOne({ name: name })
    //send error for game not existing
    if (game) {
      err.data = {content: "Game name already exists"}
      socket.emit('create error', err )
      return
    }

    //On success...
    //create player object
    const playerObject = {ready: false, playerNumber: 0, sid: socket.id}
    //create game
    game = new GameList({..._.pick(request, ['name', 'password', 'maxPlayers']), isStarted: false})
    //add player to game
    game.players = {[user.username]: playerObject}
    //save document
    game.save()
    //join game
    socket.join(name)
    //save game object to socket object
    socket.game = [game]
    //create deck for game
    gameDecks[name] = {
      deck: [...deck],
      lastId: [0]
    }
    console.log(gameDecks)
    assignCardId(name)
    // console.log(gameDecks[name].deck[20])
    // console.log(gameDecks[name].lastId)
    //send success
    socket.emit('server response create game', _.pick(game, ['name', 'players'] ))
  })
} 

const validate = req => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    user: Joi.object().required(),
    password: Joi.string().min(5).max(1024),
    maxPlayers: Joi.number().min(2).max(6).required(),
  })

  return schema.validate(req)
}

module.exports = handleCreateGameRequest