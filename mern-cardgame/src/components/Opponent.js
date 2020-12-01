import React, { useState, useEffect } from 'react';


const Opponent = ({name, cardsLeft, cards}) => {

    // const makeTestCards = () => {
    //     let testArr = []
    //     ["D1", "D2", "D3", "D4", "D5"].forEach(card => {
    //         let temp_card = new Cards(card[0], card[1], "TEST", card[0])
    //         testArr.push(temp_card)
    //     })

    // }
    
    const opponentSpaceStyle = {
        backgroundColor: "orange", 
        width: "100%", 
        height: 150,
        display: "flex"
    }

    const opponentHandStyle = {
        backgroundColor: "green", 
        width: "100%", 
        height: 150,
        display: "flex"
    }

    return (
        <div>

            {/* hand */}
            <div id="hand" style={opponentHandStyle}>
                {Array(cardsLeft).fill(
                    <div 
                    style={{width: "40px", height: "80px", border: "solid 2px"}}
                    > B </div>
                )}
            </div>

            {/* playerSpace */}
            <div id="playerSpace" style={opponentSpaceStyle}>
                {cards.map(card => {
                return (<div 
                    style={{width: "40px", height: "80px", border: "solid 2px"}}
                    // onClick={() => card.select("playerSpace")}
                > {card.suit+card.number} </div>)})}
            </div>
        </div>
    )
}

export default Opponent