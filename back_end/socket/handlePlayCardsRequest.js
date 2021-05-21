const _ = require('lodash')

module.exports = function handlePlayCardsRequest(socket, io){
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