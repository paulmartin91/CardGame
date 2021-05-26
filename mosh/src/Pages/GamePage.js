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
            if (dealTo == "All Players"){
                //copy hands
                const tempHands = {...hands}
                //create blind hand
                const blindCards = blind.map(() => [])
                //add blind hand to all players besides player
                Object.keys(tempHands).forEach(name => (name !== "openPlay" && name !== username) && tempHands[name].blind.push(...blindCards))
                //add player hand
                tempHands[username].blind = [...tempHands[username].blind, ...blind]
                //set hands
                setHands(tempHands)
            }
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


    }, [])

    const DEVoppoentPlayCards = event => console.log(hands)

    //needs to be socket request
    const leaveGame = () => history.replace('./gameSearch')


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