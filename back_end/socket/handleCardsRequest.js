const _ = require('lodash')
const getTime = require('../common/getTime')
const { deal, returnCards, shuffle, getRemaining } = require('../common/cards')
const activeGames = require('../common/games')

const handlePlayCardsRequest = (socket, io) => {
  socket.on('client_request_play_cards', async (hands, handArea) => {

    const {username} = await socket.user
    const gameName = socket.game.name

    //create a new player hand with clients cards
    let tempHandsPlayer = {
      [username]: {...hands[username]},
      openPlay: [...hands.openPlay]
    }

    //make new arr with selected cards
    let selectedCards = [
        ...hands[username].blind.filter(card => card.selected), 
        ...hands[username].open.filter(card => card.selected), 
        ...hands.openPlay.filter(card => card.selected)
    ]

    //ignore request if nothing is selected
    if (selectedCards.length < 1) return

    //filter out selected cards
    let handTypes = ['blind', 'open']
    handTypes.forEach(hand => tempHandsPlayer[username][hand] = tempHandsPlayer[username][hand].filter(card => !card.selected))
    tempHandsPlayer.openPlay = tempHandsPlayer.openPlay.filter(card => !card.selected)

    //unselect all selected cards
    selectedCards.forEach(card => card.selected = false)

    if (handArea == "openPlay") {
        //add selected cards to open play
        tempHandsPlayer.openPlay = [...tempHandsPlayer.openPlay, ...selectedCards]
    } else {
        //add selected cards hand
        tempHandsPlayer[username][handArea] = [...tempHandsPlayer[username][handArea], ...selectedCards]
    }

    //create player hand for other clients
    const tempHandsOpponents = {
      [username]: {
        blind:[], 
        open: [],
        playerNumber: hands[username].playerNumber,
      }
    }

    //add empty arrays for blind cards
    tempHandsOpponents[username].blind = await tempHandsPlayer[username].blind.map(x => [])
    tempHandsOpponents[username].open = await tempHandsPlayer[username].open.map(x => x)
    tempHandsOpponents.openPlay = tempHandsPlayer.openPlay.map(x => x)

    //send client their cards

    //copy new hand serverside
    activeGames[gameName].lastKnownHands = {...activeGames[gameName].lastKnownHands[username], ...tempHandsPlayer}

    socket.emit('server_response_play_cards', {
      hand: tempHandsPlayer
    })

    //send other clients new card state
    socket.to(socket.game.name).emit('server_response_play_cards', {
      hand: tempHandsOpponents,
    });

  })
}

const handleDealRequest = (socket, io) => {
  socket.on("client_request_deal_cards", async ({dealTo, numberOfCards, playerList}) => {

    const {username} = await socket.user
    const {players} = playerList
    //save the gamename
    const gameName = socket.game.name
    //to store delt cards
    let cardsDelt
    //get cards left in game deck
    const cardsLeft = getRemaining(gameName)  
    //number of players the user has requested to deal to
    let numberToDealTo = 1
    //change to all players if aplicable
    if (dealTo == "All Players") numberToDealTo = Object.keys(playerList).length
    //if there are not enough cards left, inform players
    if (cardsLeft < numberOfCards*numberToDealTo) {
      io.to(socket.game.name).emit('server_response_send_message', {
        message: `${numberOfCards}, but only ${cardsLeft} left in the deck`,
        username: 'Server',
        time: getTime(),
      })
      return 0
    }
    //if dealing to openPlay
    if (dealTo == "openPlay") {
      //get cards from deck
      cardsDelt = deal(gameName, numberOfCards)
      //save cards serverside
      activeGames[gameName].lastKnownHands.openPlay = [...activeGames[gameName].lastKnownHands.openPlay, ...cardsDelt]
      //send cards to players
      io.in(gameName).emit('server_response_deal_cards', {
        dealTo,
        blind: cardsDelt
      })
    //if dealing to all players
    } else if (dealTo == "All Players") {
      //iterate though player list
      Object.keys(playerList).forEach(name => {
        //get cards from deck
        cardsDelt = deal(gameName, numberOfCards)
        //save cards serverside
        activeGames[gameName].lastKnownHands[name].blind = [...activeGames[gameName].lastKnownHands[name].blind, ...cardsDelt]
        //send cards to player
        io.to(playerList[name].sid).emit('server_response_deal_cards', {
          dealTo,
          blind: cardsDelt
        })
      })
    //if to a specific player
    } else {
      //create a player hand (visible)
      cardsDelt = deal(gameName, numberOfCards)
      //create an opponent hand (blind)
      const cardsDeltOpponents = cardsDelt.map(card => [])

      //save cards serverside
      activeGames[gameName].lastKnownHands[dealTo].blind = [...activeGames[gameName].lastKnownHands[dealTo].blind, ...cardsDelt]

      //send cards to dealTo player
      io.to(playerList[dealTo].sid).emit('server_response_deal_cards', {
        dealTo,
        blind: cardsDelt
      })

      //send other clients blind
      Object.keys(playerList).forEach(name => {
        if (name !== dealTo) {
          io.to(playerList[name].sid).emit('server_response_deal_cards', {
            dealTo,
            blind: cardsDeltOpponents
          })
        }
      })
    }
  })
}

const handleReturnCardRequest = (socket, io) => {
  socket.on('client_request_return_cards', async ({hands, playerList, quantity}) => {

    const {username} = await socket.user
    const gameName = socket.game.name

    //create a temporary hand
    let tempHandsPlayer = {
      [username]: {...hands[username]},
      openPlay: [...hands.openPlay]
    }

    let cardsToReturn = []

    if (quantity == "selected") {
      
      //make new arr with selected cards
      cardsToReturn = [
        ...hands[username].blind.filter(card => card.selected), 
        ...hands[username].open.filter(card => card.selected), 
        ...hands.openPlay.filter(card => card.selected)
      ]

      //ignore request if nothing is selected
      if (cardsToReturn.length < 1) return

      //filter out selected cards
      let handTypes = ['blind', 'open']
      handTypes.forEach(hand => tempHandsPlayer[username][hand] = tempHandsPlayer[username][hand].filter(card => !card.selected))
      tempHandsPlayer.openPlay = tempHandsPlayer.openPlay.filter(card => !card.selected)

    }

    //if returning player cards
    if (quantity == "player") {
      cardsToReturn = [
        //create array with selected cards
        ...hands[username].blind, 
        ...hands[username].open,
      ]
    }

    //if retrning openPlay cards
    if (quantity == "neutral") {
      //create array with selected cards
      cardsToReturn = [
        ...hands.openPlay,
      ]
    }

    //unselect all selected cards
    cardsToReturn.forEach(card => card.selected = false)

    //return cards to deck
    returnCards(gameName, cardsToReturn)

    let tempHandsOpponents = {}

    //if returning all selected cards
    if (quantity == "selected") {
      //copy new hands serverside
      activeGames[gameName].lastKnownHands[username] = {...tempHandsPlayer[username]}
      activeGames[gameName].lastKnownHands.openPlay = [...tempHandsPlayer.openPlay]

      //send any cards back to player
      io.to(playerList[username].sid).emit('server_response_return_cards', {
        blind: {...tempHandsPlayer},
        dealTo: username
      })

      //copy the temporary hand
      tempHandsOpponents = {...tempHandsPlayer}

    }

    //if returning all player cards
    if (quantity == "player") {
      //copy new hand serverside
      activeGames[gameName].lastKnownHands[username] = { playerNumber: tempHandsPlayer[username].playerNumber, blind: [], open: [] }

      //send any cards back to player
      io.to(playerList[username].sid).emit('server_response_return_cards', {
        blind: {...tempHandsPlayer, [username]: { playerNumber: tempHandsPlayer[username].playerNumber, blind: [], open: [] }},
        dealTo: username
      })

      //copy the temporary hand
      tempHandsOpponents = {...tempHandsPlayer, [username]: { playerNumber: tempHandsPlayer[username].playerNumber, blind: [], open: [] }}

    }

    if (quantity == "neutral") {

      //copy new hand serverside
      activeGames[gameName].lastKnownHands.openPlay = []

      //send all clients open hand
      Object.keys(playerList).forEach(name => {
        io.to(playerList[name].sid).emit('server_response_return_cards', {
          dealTo: 'neutral'
        })
      })
      return
    }

    //hide blind cards
    tempHandsOpponents[username].blind = tempHandsOpponents[username].blind.map(card => []) 

    //send other clients hand
    Object.keys(playerList).forEach(name => {
      if (name !== username) {
        io.to(playerList[name].sid).emit('server_response_return_cards', {
          blind: {...tempHandsOpponents},
          dealTo: username
        })
      }
    })

    
  })
}

const handleShuffleDeckRequest = (socket, io) => {
  socket.on('client_request_shuffle_deck', () => {
    const gameName = socket.game.name
    shuffle(gameName)
    io.to(socket.game.name).emit('server_response_send_message', {
      message: 'Deck shuffled',
      username: socket.user.username,
      time: getTime(),
    })
  })
}

module.exports = {
  handlePlayCardsRequest,
  handleDealRequest,
  handleReturnCardRequest,
  handleShuffleDeckRequest
}