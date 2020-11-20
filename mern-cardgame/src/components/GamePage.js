import React, { useState, useEffect } from 'react';

import C2 from "../CardPics/2C.png"
import C3 from "../CardPics/3C.png"
import C4 from "../CardPics/4C.png"
import C5 from "../CardPics/5C.png"
import C6 from "../CardPics/6C.png"
import C7 from "../CardPics/7C.png"
import C8 from "../CardPics/8C.png"
import C9 from "../CardPics/9C.png"
import C10 from "../CardPics/10C.png"
import C11 from "../CardPics/11C.png"
import C12 from "../CardPics/12C.png"
import C13 from "../CardPics/13C.png"
import C14 from "../CardPics/14C.png"

import D2 from "../CardPics/2D.png"
import D3 from "../CardPics/3D.png"
import D4 from "../CardPics/4D.png"
import D5 from "../CardPics/5D.png"
import D6 from "../CardPics/6D.png"
import D7 from "../CardPics/7D.png"
import D8 from "../CardPics/8D.png"
import D9 from "../CardPics/9D.png"
import D10 from "../CardPics/10D.png"
import D11 from "../CardPics/11D.png"
import D12 from "../CardPics/12D.png"
import D13 from "../CardPics/13D.png"
import D14 from "../CardPics/14D.png"

import H2 from "../CardPics/2H.png"
import H3 from "../CardPics/3H.png"
import H4 from "../CardPics/4H.png"
import H5 from "../CardPics/5H.png"
import H6 from "../CardPics/6H.png"
import H7 from "../CardPics/7H.png"
import H8 from "../CardPics/8H.png"
import H9 from "../CardPics/9H.png"
import H10 from "../CardPics/10H.png"
import H11 from "../CardPics/11H.png"
import H12 from "../CardPics/12H.png"
import H13 from "../CardPics/13H.png"
import H14 from "../CardPics/14H.png"

import S2 from "../CardPics/2S.png"
import S3 from "../CardPics/3S.png"
import S4 from "../CardPics/4S.png"
import S5 from "../CardPics/5S.png"
import S6 from "../CardPics/6S.png"
import S7 from "../CardPics/7S.png"
import S8 from "../CardPics/8S.png"
import S9 from "../CardPics/9S.png"
import S10 from "../CardPics/10S.png"
import S11 from "../CardPics/11S.png"
import S12 from "../CardPics/12S.png"
import S13 from "../CardPics/13S.png"
import S14 from "../CardPics/14S.png"

const cardDeck = {
        H2: H2,
        H3: H3,
        H4: H4,
        H5: H5,
        H6: H6,
        H7: H7,
        H8: H8,
        H9: H9,
        H10: H10,
        H11: H11,
        H12: H12,
        H13: H13,
        H14: H14,
        C2: C2,
        C3: C3,
        C4: C4,
        C5: C5,
        C6: C6,
        C7: C7,
        C8: C8,
        C9: C9,
        C10: C10,
        C11: C11,
        C12: C12,
        C13: C13,
        C14: C14,
        D2: D2,
        D3: D3,
        D4: D4,
        D5: D5,
        D6: D6,
        D7: D7,
        D8: D8,
        D9: D9,
        D10: D10,
        D11: D11,
        D12: D12,
        D13: D13,
        D14: D14,
        S2: S2,
        S3: S3,
        S4: S4,
        S5: S5,
        S6: S6,
        S7: S7,
        S8: S8,
        S9: S9,
        S10: S10,
        S11: S11,
        S12: S12,
        S13: S13,
        S14: S14,
}

const GamePage = ({socket, ENDPOINT, messages, setMessages}) => {

    //States
    const [numberOfCardsToDeal, setNumberOfCardsToDeal] = useState(1)
    const [deckCount, setDeckCount] = useState(52)
    const [hand, setHand] = useState([])
    //const [selected, setSelected] = useState([])
    const [playerSpace, setPlayerSpace] = useState([])
    const [board, setBoard] = useState([])

    useEffect(()=>{

        //Messaging System
        socket.on('recieve message', async message => {
            if (message.location == "GamePage") {
                setMessages(messages => [...messages, message])
                document.getElementById(`messageBox`).scrollTop = document.getElementById(`messageBox`).scrollHeight
                document.getElementById(`messagesInput`).value = ''
            }
        })

        //recieve delt hand
        socket.on('hand delt', async result => {
            if (!result.enoughCards) {
                console.log(`you've requested too many cards, there ${result.cardsLeft == 1 ? "is" : "are"} only ${result.cardsLeft} left`)
            } else {
                let newArr = await []
                await result.hand.forEach(card => {
                    let temp_card = new Cards(card.suit, card.value, socket.username, card.CID) //suit, number, owner, CID
                    newArr.push(temp_card)
                    // let card = `${x.suit}${x.value}`
                    // let cardReversed = card.split("").reverse().join("")
                    // newArr.push(cardReversed)
                })
                
                await console.log(newArr)
                await console.log(result)
                setHand(hand => [...hand, ...newArr])

                //newArr.forEach(x=>console.log(`../CardPics/${x}.png"`))
                // let tempHandArr = []
                // console.log(`player hand = ${playerHand}`)
                // console.log(`tempHandArr = ${tempHandArr}`)
                // setDeckCount(result.cardsLeft)
                // await result.hand.forEach(x=> {
                //     console.log(x.value)
                //     tempHandArr.push({"value": x.value, "suit": x.suit})
                //     console.log(tempHandArr)
                // })
                // setTimeout(()=>setPlayerHand(playerHand => [...playerHand, tempHandArr]), 200)//playerHand => [...playerHand, tempHandArr])
                // // document.getElementById("deckCount").innerHTML = result.cardsLeft
                // // result.hand.forEach(x=> {
                // // document.getElementById('hand').innerHTML +=`<div class = "img-container"><img src="${getCard(x.suit, x.value)}" onclick="playCard(this)"></img></div>`
            }//)
        });
    }, [ENDPOINT])

    const handleSubmit = event => {
        if (event.target.name == "deal options"){
            socket.emit('deal cards request', {
                number: event.target.number.value,
                to: '' //dealTo
            })
        }
       
        /*
        if (event.target.message.value.length > 0) {
            socket.emit(`send message`, {
                message: event.target.message.value,
                username: socket.username,
                location: 'GamePage',
            })
        }
        */
        event.preventDefault();
    }

    const handleCLick = event => {
        if (event.target.value == "deal button") {
            console.log(`deal ${numberOfCardsToDeal} to ${event.target.name}`)
            socket.emit('deal cards request', {
                number: numberOfCardsToDeal,
                to: event.target.name
            })
        //     console.log(`deal ${numberOfCardsToDeal} to ${event.target.name}`)
        }
        if (event.target.value == "TEST") {
            console.log(hand)
        }
/*
        if (event.target.value == "card") {
            let selectedCard = card.src.match(/(.{2})\.png$/)[1]
            console.log(selectedCard)
            // socket.emit('request card played', {
            //     card: selectedCard,
            //     cardSrc: card.src,
            //     blind: false
            // })
            // card.remove()
        }

        */

    }

    const select = async (card, location) => {

        const selectFunction = (locationState) => {
          locationState(hand => 
            hand.map(handCard => {
              if (card.CID == handCard.CID){
                handCard.selected = !handCard.selected
              }
              return handCard
            })
          )
        }
    
    location == "hand" && selectFunction(setHand)
    location == "playerSpace" && selectFunction(setPlayerSpace)
    location == "board" && selectFunction(setBoard)

    }

    const play =  (event) => {

        const playFunction = async (targetFunction, targetState) => {
    
          let selected = await []
    
          //board
          selected = await [...selected, ...board.filter(card => card.selected)]
          setBoard(board => board.filter(card => !card.selected))
          //hand
          selected = await [...selected, ...hand.filter(card => card.selected)]
          setHand(hand => hand.filter(card => !card.selected))
          //playerSpace
          selected = await [...selected, ...playerSpace.filter(card => card.selected)]
          setPlayerSpace(playerSpace => playerSpace.filter(card => !card.selected))
    
          await selected.map(card => {
            card.selected = false
            return card
          })
    
          targetFunction(targetState => [...targetState, ...selected])
        }
    
        event.target.id == "board" && playFunction(setBoard, board)
        event.target.id == "playerSpace" && playFunction(setPlayerSpace, playerSpace)
        event.target.id == "hand" && playFunction(setHand, hand)
    
      }

    class Cards {
        constructor(suit, number, owner, CID, selected = false){
          this.CID = CID
          this.suit = suit
          this.number = number
          this.owner = owner
          this.selected = false
          //console.log(this.suit)
        }
    
        select(location){
          console.log(location)
          this.selected = !this.selected
          select(this, location)
        }
      }


    return(
        <div class = "container-fluid gamePage" >
            <button value="TEST" onClick={handleCLick}>TEST</button>
            <div class="container-fluid text-center">
                <h1>Card Game Page - <span id="gameUsername"></span></h1>
            </div>
            {/* Deal Controls */}
            <div class = "row" style={{height: "calc(100% - 60px)"}}>
                <div class = "col-sm-3" style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <div class="container" style={{backgroundColor: '', height: "50%", display: "flex", justifyContent: "spaceBetween", flexDirection: "column", color: "black"}}>
                        <div class="container mb-1" style={{backgroundColor: "white", height: "100%", color: "black"}}>
                            <h2>Deal Options</h2>
                            <input type="number" value={numberOfCardsToDeal} onChange={event => setNumberOfCardsToDeal(event.target.value)}/>
                            <button name="All" value="deal button" onClick={handleCLick}>All</button>
                        </div>
                    </div>
                    {/* Message Box */}
                    <div class="mt-5">
                    <div class="border">
                        <div id="messageBox" style={{cursor: "default", height: 150, overflow: "scroll"}}>
                            <p id="messages" style={{wordBreak: "break-all"}}>
                                { messages.map( message => message.username != "Server" && <p1><span class="text-muted small">{message.time == 'n/a' ? '' : [message.time]}</span>{message.username}: {message.message}<br /></p1>) }
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div class="input-group">
                                <input type="text" style={{borderRadius: 0}} name="message" class="border form-control" placeholder="Type message..." id="messagesInput" />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="submit" style={{borderRadius: 0}}>Send Message</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Gameboard */}
                </div>
                <div style={{backgroundColor: "red", margin:"auto", width: 1000, height: 350, display: "flex", flexDirection: "column"}}>
                    {/*<div style={{backgroundColor: "yellow", margin:"auto", width: 800, height: 100, display: "flex"}} />*/}
                    <div id="board" onClick={play} style={{backgroundColor: "blue", margin:"auto", width: 800, height: 100, display: "flex"}} >
                    {board.map(card => {
                        return (<div 
                        style={{width: "40px", height: "80px", border: "solid 2px", backgroundColor: card.selected && "white"}} 
                        onClick={() => card.select("board")}
                        > {card.suit+card.number} </div>)})}
                    </div>
                    <div id="playerSpace" onClick={play} style={{backgroundColor: "orange", margin:"auto", width: 800, height: 100, display: "flex"}}>
                        {playerSpace.map(card => {
                        return (<div 
                            style={{width: "40px", height: "80px", border: "solid 2px", backgroundColor: card.selected && "white"}}
                            onClick={() => card.select("playerSpace")}
                        > {card.suit+card.number} </div>)})}
                    </div>
                    </div>
                    <div id="hand" onClick={play} style={{backgroundColor: "green", margin: "auto", width: 800, height: 150, display: "flex"}}>
                        {hand.map(card => {
                        return (<div 
                        style={{width: "40px", height: "80px", border: "solid 2px", backgroundColor: card.selected && "white"}}
                        onClick={() => card.select("hand")}
                        > {card.suit+card.number} </div>)})}
                    </div>
            </div>
        </div>
    )
}

export default GamePage