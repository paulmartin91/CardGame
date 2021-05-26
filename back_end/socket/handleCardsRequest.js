const _ = require('lodash')
const { deal } = require('../common/cards')

// const DEVrequestCards = numberOfCards =>  {
//   return [
//       {'id': 1, 'suit': 'C', 'value': 5, 'selected': false},
//       {'id': 2, 'suit': 'D', 'value': 2, 'selected': false},
//       {'id': 3, 'suit': 'S', 'value': 3, 'selected': false},
//       {'id': 4, 'suit': 'C', 'value': 4, 'selected': false},
//       {'id': 5, 'suit': 'H', 'value': 7, 'selected': false}
//   ].splice(0, numberOfCards)
// }

const handlePlayCardsRequest = (socket, io) => {
  socket.on('client_request_play_cards', async (hands, handArea) => {

    const {username} = await socket.user

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

    console.log('tempHandsPlayer', tempHandsPlayer)
    console.log('tempHandsOpp', tempHandsOpponents)

    //send client their cards
    socket.emit('server_response_play_cards', {
      hand: tempHandsPlayer
    })

    //send other clients new card state
    socket.to(socket.game[0].name).emit('server_response_play_cards', {
      hand: tempHandsOpponents,
    });

  })
}

const handleDealRequest = (socket, io) => {
  socket.on("client_request_deal_cards", async ({dealTo, numberOfCards, playerList}) => {

    const {username} = await socket.user
    const {players} = playerList
    const gameName = socket.game[0].name

    if (dealTo == "All Players") {
      Object.keys(playerList).forEach(name => {
        io.to(playerList[name].sid).emit('server_response_deal_cards', {
          dealTo,
          blind: deal(gameName, numberOfCards)
        })
      })
    } else {

      //create a player hand (visible)
      const dealtCardsPlayer = deal(gameName, numberOfCards)
      //create an opponent hand (blind)
      const dealtCardsOpponents = dealtCardsPlayer.map(card => [])

      //send cards to dealTo player
      io.to(playerList[dealTo].sid).emit('server_response_deal_cards', {
        dealTo,
        blind: dealtCardsPlayer
      })

      //send other clients blind
      Object.keys(playerList).forEach(name => {
        if (name !== dealTo) {
          console.log(dealtCardsOpponents)
          io.to(playerList[name].sid).emit('server_response_deal_cards', {
            dealTo,
            blind: dealtCardsOpponents
          })
        }
      })
    }
  })
}

module.exports = {
  handlePlayCardsRequest,
  handleDealRequest
}