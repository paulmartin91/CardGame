import React, { useState, useEffect } from 'react';

const GamePage = ({socket, ENDPOINT, messages, setMessages}) => {

    //States

    useEffect(()=>{

        socket.on('recieve message', async message => {
            if (message.location == "GamePage") {
                setMessages(messages => [...messages, message])
                document.getElementById(`messageBox`).scrollTop = document.getElementById(`messageBox`).scrollHeight
                document.getElementById(`messagesInput`).value = ''
            }
        })

    }, [ENDPOINT])

    const handleSubmit = event => {
        
        if (event.target.message.value.length > 0) {
            socket.emit(`send message`, {
                message: event.target.message.value,
                username: socket.username,
                location: 'GamePage',
            })
        }
        event.preventDefault();
    }

    return(
        <div class = "container-fluid gamePage" >
            <div class="container-fluid text-center">
                <h1>Card Game Page - <span id="gameUsername"></span></h1>
            </div>
            {/* Deal Controls */}
            <div class = "row" style={{height: "calc(100% - 60px)"}}>
                <div class = "col-sm-3" style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <div class="container" style={{backgroundColor: '', height: "50%", display: "flex", justifyContent: "spaceBetween", flexDirection: "column", color: "black"}}>
                        <div class="container mb-1" style={{backgroundColor: "white", height: "100%", color: "black"}}>
                            <h2>Deal Options</h2>
                            <form class="form-inline mt-3" onSubmit={handleSubmit}>
                                <div class="form-group">
                                    <div class="input-group">
                                        <input class="form-control" name="number" type="number" min="1" max="52" />
                                    </div>
                                    <div class="dropdown">
                                        <button type="submit" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            Deal to...
                                        </button>
                                        <div id="dealSelect" class="dropdown-menu">
                                            <li>
                                                <input type="submit" onclick="setDealOption(this)" class="form-control btn" name="submit" value="All" style={{width: "100%"}} />
                                            </li>
                                        </div>
                                    </div>
                                </div>
                            </form>
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
                <div class = "col mb-2">
                    <div class="container game-board-4p" style={{color: "black", height: "100%", backgroundColor: '', display: "flex"}}>
                        <div class="container align-self-center" style={{display: "flex", backgroundColor: "green", borderRadius: 50, flexDirection: "column", justifyContent: "space-between", height: 500}}>
                            <div class = "container" id="otherPlayers" style={{height: 150, maxWidth: 700}}>
                            </div>
                            <div class = "container" id="gameCards" id="gameBoard" class="gameBoard" style={{display: "flex", alignItems: "center", color: "black", border: "dashed 1px", maxHeight: 150, maxWidth: 800, minWidth: 800}}>
                                <div class="img-container-blind" style={{minWidth: 70}}><div id="deckCount" style={{position: "absolute", height: 25, width: 20, background: "white", borderRadius: 5, padding: 1, zIndex: 5}}>52</div><img src="CardPics/blue_back.png"></img></div>
                            </div>
                            <div class = "container" id="hand" style={{display: "flex", color: "black", border: "dashed 1px", height: 150, maxWidth: 700}}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GamePage