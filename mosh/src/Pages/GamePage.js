import React, { useEffect, useState } from 'react';

import MessageBox from '../Containers/MessageBox';
import TableContainer from '../Containers/TableContainer';
import GameTools from '../Containers/GameTools'
import socket, {connectSocket} from '../Services/Socket/socket';
import { getCurrentUser, logout } from '../Services/authservice';
import leaveGame from '../Services/Socket/leaveGame'

const GamePage = ({ history, username, playerList, setPlayerList, messages, setMessages, setUsername }) => {

    const [numberOfCards, setNumberOfCards] = useState(1)
    const [hands, setHands] = useState(() => {
        let tempObj = {...playerList}
        Object.keys(tempObj).forEach(name => tempObj[name] = {'playerNumber': tempObj[name].playerNumber, 'blind': [], 'open': []})
        tempObj.openPlay =  []
        return tempObj
    })
    const [selected, setSelected] = useState(false)

    useEffect(() => {

        //make sure the socket is connected
        connectSocket()

        //if user refreshes page when server is down
        Object.keys(playerList).length == 0 && history.replace('/gameSearch')

        // //FOR DEVELOPMENT
        // socket.removeAllListeners("disconnect");
        // //

        socket.on('server_response_deal_cards', ({dealTo, blind}) => {
            if (dealTo == "All Players"){
               setHands(oldHand => {
                //copy hands
                const tempHands = {...oldHand}
                //create blind hand
                const blindCards = blind.map(() => [])
                //add blind hand to all players besides player
                Object.keys(tempHands).forEach(name => (name !== "openPlay" && name !== username) && tempHands[name].blind.push(...blindCards))
                //add player hand
                tempHands[username].blind = [...tempHands[username].blind, ...blind]
                return tempHands
               })
            }
            //Open Play
            else if (dealTo == "openPlay") {
                setHands(oldHand => {
                    return {
                        ...oldHand, 
                        openPlay: [...oldHand.openPlay, ...blind]
                    }
                })
            }
            //Specific Player
            else {
                setHands(oldHand => {
                    const tempHand = [...blind, ...oldHand[dealTo].blind]
                    return {
                        ...oldHand,
                        [dealTo]: {...oldHand[dealTo], blind: tempHand} 
                    }
                })
            }
        })

        socket.on('server_response_play_cards', ({ hand }) => {
            setHands(oldHand => {
                return {
                    ...oldHand,
                    ...hand
                }
            })
        })

        socket.on('server_response_return_cards', ({blind, dealTo}) => {
            if (dealTo == "neutral") {
                setHands(oldHand => {
                    return {
                        ...oldHand,
                        openPlay: []
                    }
                })
            } else {
                setHands(oldHand => {
                    return {
                        ...oldHand,
                        [dealTo]: blind[dealTo],
                        openPlay: blind.openPlay
                    }
                })
            }
        })

        socket.on("player_left", ({playerList, username}) => {
            setPlayerList(playerList)
            setHands(oldHands => {
                let tempHands = {...oldHands}
                delete tempHands[username]
                return tempHands
            })
        })
    }, [])

    // //needs to be socket request
    // const leaveGame = () => history.replace('./gameSearch')

    const dealCards = dealTo => socket.emit('client_request_deal_cards', {dealTo, numberOfCards, playerList})

    const select = (id, handArea) => {
        let tempHands = {...hands}
        if (handArea == "openPlay") {
            tempHands.openPlay.find(card => card.id == id).selected = !tempHands.openPlay.find(card => card.id == id).selected
        } else {
            tempHands[username][handArea].find(card => card.id == id).selected = !tempHands[username][handArea].find(card => card.id == id).selected
        }

        let selectedCards = [
            ...tempHands[username].blind.filter(card => card.selected), 
            ...tempHands[username].open.filter(card => card.selected), 
            ...tempHands.openPlay.filter(card => card.selected)
        ]

        setSelected(selectedCards.length > 0)

        setHands(tempHands)
    }

    const playCard = (event, handArea) => {
        if (event.target.nodeName == 'DIV') selected && socket.emit('client_request_play_cards', hands, handArea)
    }

    const returnCard = (quantity) => socket.emit('client_request_return_cards', {hands, playerList, quantity})
    
    const shuffleDeck = () => socket.emit('client_request_shuffle_deck')

    return (
        <>
          {Object.keys(playerList).length > 0 &&
          <div className="d-flex">
                <div className="w-25 border-right d-flex flex-column justify-content-between align-items-center"
                    style={{minWidth: 200}}
                >
                    <button onClick={() => {
                        //socket.emit('client_request_test')
                        console.log(hands)
                    }}>TEST BUTTON</button>
                    <GameTools
                        hands={hands}
                        number={numberOfCards}
                        setNumber={setNumberOfCards}
                        dealCards={dealCards}
                        leaveGame={leaveGame}
                        selected={selected}
                        returnCard={returnCard}
                        shuffleDeck={shuffleDeck}
                    />
                    <MessageBox
                        username={username} 
                        messages={messages}
                        setMessages={setMessages}
                    />  
                </div>
                <TableContainer 
                    username={username}
                    playerList={playerList}
                    hands = {hands}
                    select={select}
                    playCard={playCard}
                    username={username}
                />
            </div>}
        </>
    );
}

export default GamePage;