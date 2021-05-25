import React, { useEffect, useState } from 'react';

import MessageBox from '../Containers/MessageBox';
import TableContainer from '../Containers/TableContainer';
import GameTools from '../Containers/GameTools'
import socket from '../Services/Socket/socket';
import { getCurrentUser, logout } from '../Services/authservice';

function GamePage({ history, username, playerList, messages, setMessages, setUsername }) {

    const [numberOfCards, setNumberOfCards] = useState(1)
    const [hands, setHands] = useState(() => {
        let tempObj = {...playerList}
        Object.keys(tempObj).forEach(name => tempObj[name] = {'playerNumber': tempObj[name].playerNumber, 'blind': [], 'open': []})
        tempObj.openPlay =  []
        return tempObj
    })
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        //FOR DEVELOPMENT
        socket.removeAllListeners("disconnect");

        socket.on('server_response_deal_cards', ({dealTo, blind}) => {
            console.log(dealTo, blind)
            //WORKS
            setHands(oldHand => {
                return {
                    ...oldHand,
                    [dealTo]: {...oldHand[dealTo], blind: blind} 
                }
            })
        })

        socket.on('server_response_play_cards', ({ hand }) => {
            setHands(oldHand => {
                return {
                    ...oldHand,
                    ...hand
                }
            })
        })


    }, [])

    const DEVoppoentPlayCards = event => {     
        console.log(hands)   
        // let tempHands = {...hands}

        // let selectedCards = [
        //     {'id': 2, 'suit': 'D', 'value': 2, 'selected': false},
        //     {'id': 3, 'suit': 'S', 'value': 3, 'selected': false},
        //     {'id': 4, 'suit': 'C', 'value': 4, 'selected': false},
        //     {'id': 5, 'suit': 'H', 'value': 7, 'selected': false}
        // ]

        // tempHands['john'].blind = []
        // tempHands.openPlay = selectedCards

        // //set hands
        // setHands(tempHands)
    }

    //needs to be socket request
    const leaveGame = () => history.replace('./gameSearch')


    const dealCards = dealTo => {
        socket.emit('client_request_deal_cards', {dealTo, numberOfCards, playerList})
    }

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
        if (event.target.nodeName == 'DIV') {
            selected && socket.emit('client_request_play_cards', hands, handArea)
            /*
            //copy hands into temp object
            let tempHands = {...hands}
            //make new arr with selected cards
            let selectedCards = [
                ...hands[username].blind.filter(card => card.selected), 
                ...hands[username].open.filter(card => card.selected), 
                ...hands.openPlay.filter(card => card.selected)
            ]
            //filter out selected cards
            let handTypes = ['blind', 'open']
            handTypes.forEach(hand => tempHands[username][hand] = tempHands[username][hand].filter(card => !card.selected))
            tempHands.openPlay = tempHands.openPlay.filter(card => !card.selected)

            //unselect all selected cards
            selectedCards.forEach(card => card.selected = false)

            if (handArea == "openPlay") {
                //add selected cards to open play
                tempHands.openPlay = [...tempHands.openPlay, ...selectedCards]
            } else {
                //add selected cards hand
                tempHands[username][handArea] = [...tempHands[username][handArea], ...selectedCards]
            }
            //set hands
            setHands(tempHands)
            */
        }
    }

    return (
        <div className="d-flex">
            <div className="w-25 mr-3 border-right d-flex flex-column justify-content-between">
                <button onClick={DEVoppoentPlayCards}>OPPONENT PLAY</button>
                <GameTools
                    hands={hands}
                    number={numberOfCards}
                    setNumber={setNumberOfCards}
                    dealCards={dealCards}
                    leaveGame={leaveGame}
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
        </div>
    );
}

export default GamePage;