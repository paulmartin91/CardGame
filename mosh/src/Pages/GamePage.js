import React, { useEffect, useState } from 'react';

import MessageBox from '../Containers/MessageBox';
import TableContainer from '../Containers/TableContainer';
import GameTools from '../Containers/GameTools'

function GamePage({ history, username, playerList }) {

    const [number, setNumber] = useState(1)
    const [hands, setHands] = useState(() => {
        let tempObj = {...playerList}
        Object.keys(tempObj).forEach(name => tempObj[name] = {'playerNumber': tempObj[name].playerNumber, 'blind': [], 'open': []})
        tempObj.openPlay =  []
        return tempObj
    })

    const DEVrequestCards = name =>  {
        if (name == username) {
            return [
                {'id': 1, 'suit': 'C', 'value': 5, 'selected': false},
                {'id': 2, 'suit': 'D', 'value': 2, 'selected': false},
                {'id': 3, 'suit': 'S', 'value': 3, 'selected': false},
                {'id': 4, 'suit': 'C', 'value': 4, 'selected': false},
                {'id': 5, 'suit': 'H', 'value': 7, 'selected': false}
            ].splice(0, number)
        } else {
            return [
                {}, {}, {}, {}
            ].splice(0, number)
        }
    }

    const DEVoppoentPlayCards = event => {            
        let tempHands = {...hands}

        let selectedCards = [
            {'id': 2, 'suit': 'D', 'value': 2, 'selected': false},
            {'id': 3, 'suit': 'S', 'value': 3, 'selected': false},
            {'id': 4, 'suit': 'C', 'value': 4, 'selected': false},
            {'id': 5, 'suit': 'H', 'value': 7, 'selected': false}
        ]

        tempHands['john'].blind = []
        tempHands.openPlay = selectedCards

        //set hands
        setHands(tempHands)
    }

    const leaveGame = () => history.replace('./gameSearch')

    const dealCards = dealTo => {
        if (dealTo == 'All Players') {
            console.log('all players')
        } else {
            const tempObj = {...hands}
            tempObj[dealTo].blind = [...tempObj[dealTo].blind, ...DEVrequestCards(dealTo, number)]
            // tempArray[dealTo][0] = [...tempArray[dealTo][0], ...DEVrequestCards(dealTo, number)]
            setHands(tempObj)
        }
    }

    const select = (id, handArea) => {
        console.log('select')
        let tempHands = {...hands}
        if (handArea == "openPlay") {
            tempHands.openPlay.find(card => card.id == id).selected = !tempHands.openPlay.find(card => card.id == id).selected
        } else {
            tempHands[username][handArea].find(card => card.id == id).selected = !tempHands[username][handArea].find(card => card.id == id).selected
        }
        setHands(tempHands)
    }

    const playCard = (event, handArea) => {
        if (event.target.nodeName == 'DIV') {
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
        }
    }

    return (
        <div className="d-flex">
            <div className="w-25 mr-3 border-right d-flex flex-column justify-content-between">
                <button onClick={DEVoppoentPlayCards}>OPPONENT PLAY</button>
                <GameTools
                    hands={hands}
                    number={number}
                    setNumber={setNumber}
                    dealCards={dealCards}
                    leaveGame={leaveGame}
                />
                <MessageBox
                    username={username} 
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