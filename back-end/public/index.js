var socket = io();
//const gameroom = io('/gameroom');


//MISC
//Get the time
const getTime = () => {
    let unix_timestamp = Math.round((new Date()).getTime() / 1000);
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2)// + ':' + seconds.substr(-2);
    return formattedTime
}

//load page
// const loadPage = (page) => {
//     if (page == 'game-browse') {}
//     if (page == 'lobbyPage') {}
//     if (page == 'gamePage') {}
// }

//PAGE ROUTING

socket.on('redirect', (destination)=> {
    window.location.href = destination;
});

//LOGIN PAGE

// Sets the client's username
let login = (event) => {
    socket.emit('login attempt', {
        username: event.username.value,
        password: event.password.value
    });
}

//Sends request to create new user
const newUser = (event) => {
    socket.emit('new user request', {
        username: event.username.value,
        password: event.password.value,
        email: event.email.value
    })
}

socket.on('new user response', response => {
    if (response.success) {
        console.log(response.user)
        document.getElementById('newUserInvalidEmail').style.display = 'none'
        document.getElementById('newUserInvalidUsername').style.display = 'none'
        document.getElementById('newUserSuccess').style.display = ''
        document.getElementById('loginUsername').value = response.user.username
    } else {
        if (response.reason == 'Email address already exists') {
            document.getElementById('newUserInvalidEmail').style.display = ''
            document.getElementById('newUserInvalidUsername').style.display = 'none'
            document.getElementById('newUserSuccess').style.display = 'none'
        }
        if (response.reason == 'Username already exists') {
            document.getElementById('newUserInvalidUsername').style.display = ''
            document.getElementById('newUserInvalidEmail').style.display = 'none'
            document.getElementById('newUserSuccess').style.display = 'none'
        }
    }
})

//responds to login attempt
socket.on('log in attempt response', response => {
    console.log(response)
    if (response.success === true) {
        //successful login
        socket.username = response.username
        document.getElementById("loginPage").style.display = 'none'
        document.getElementById("game-browse").style.display = ''
        if (Object.keys(response.gameList).length == 0) {
            console.log('no games')
            document.getElementById('activeGames').innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-center">No active games</li>`
        } else {
            Object.keys(response.gameList).forEach(game => {
                document.getElementById('activeGames').innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                        ${response.gameList[game].name}
                        <span class="ml-3 badge badge-primary badge-pill">${response.gameList[game].currentPlayers}/${response.gameList[game].maxPlayers}</span>
                    </span> 
                    ${!response.gameList[game].password ? 
                    `<button onclick="joinGame(this, '${response.gameList[game].name}')" class="btn btn-primary" >Join</button>`
                    :
                    `<form class="input-group" onsubmit="joinGame(this, '${response.gameList[game].name}');return false">
                        <input name="gamePass" type="password" class="form-control" placeholder="Password 6-12" pattern=".{6,12}" required>
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="submit">Join</button>
                        </div>
                    </form>`
                    }
                </li>
                `
            })
        }
        //onsubmit="login(this);return false"
        //"joinGame(this, ${response.gameList[game].name});return false"
        document.getElementById("lobbyUsername").innerHTML = `${socket.username}`
        document.getElementById("gameUsername").innerHTML = `${socket.username}`
    } else {
        if (!response.exists){
            //username doesnt exit
            document.getElementById('loginAlreadyLoggedIn').style.display = 'none'
            document.getElementById('loginInvalidPassword').style.display = 'none'
            document.getElementById('loginInvalidUsername').style.display = ''
        } else if (!response.password){
            //password inccorect
            document.getElementById('loginAlreadyLoggedIn').style.display = 'none'
            document.getElementById('loginInvalidUsername').style.display = 'none'
            document.getElementById('loginInvalidPassword').style.display = ''
        } else {
            //user already logged in
            document.getElementById('loginInvalidUsername').style.display = 'none'
            document.getElementById('loginInvalidPassword').style.display = 'none'
            document.getElementById('loginAlreadyLoggedIn').style.display = ''
        }
    }
})

//hides warning
const hide = (event) => {
    event.parentElement.style.display = "none"
}


//GAME BROWSE PAGE

//request refresh games
const refreshGames = () => {
    socket.emit('request refresh games')
}

//handle refresh games response
socket.on('response refresh games', async response => {
    document.getElementById('activeGames').innerHTML = ''
    if (Object.keys(response.gameList).length == 0) {
        console.log('no games')
        document.getElementById('activeGames').innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-center">No active games</li>`
    } else {
        Object.keys(response.gameList).forEach(game => {
            document.getElementById('activeGames').innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                    ${response.gameList[game].name}
                    <span class="ml-3 badge badge-primary badge-pill">${response.gameList[game].currentPlayers}/${response.gameList[game].maxPlayers}</span>
                </span> 
                ${!response.gameList[game].password ? 
                `<button onclick="joinGame(this, '${response.gameList[game].name}')" class="btn btn-primary" >Join</button>`
                :
                `<form class="input-group" onsubmit="joinGame(this, '${response.gameList[game].name}');return false">
                    <input name="gamePass" type="password" class="form-control" placeholder="Password 6-12" pattern=".{6,12}" required>
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="submit">Join</button>
                    </div>
                </form>`
                }
            </li>
            `
        })
    }
})

const createGame = (event) => {
    socket.emit('request create new game', {
        name: event.gameName.value,
        password: event.gamePass.value
    })
}

socket.on('response create new game', response => {
    if (response.exists) {
        console.log('game already exists')
    } else {
        document.getElementById("game-browse").style.display = 'none'
        document.getElementById("lobbyPage").style.display = ''
        socket.gameName = response.name
        document.getElementById("lobyGameName").innerHTML = `<h1>${response.name}</h1>`
    }
})

//Join a game
const joinGame = (event, gameName) => {
    console.log(event)
    console.log(gameName)
    let password = event.gamePass == undefined ? false : event.gamePass.value
    socket.emit('join game request', {
        name: gameName,
        password: password
    })
}

//Join game response
socket.on('join game response', response => {
    document.getElementById("game-browse").style.display = 'none'
    document.getElementById("lobbyPage").style.display = ''
    socket.gameName = response.name
    document.getElementById("lobyGameName").innerHTML = `<h1>${response.name}</h1>`
})


//LOBBY PAGE

//inform userbase new user has joined
socket.on('new user joined game', (user) => {
    console.log(user)
    document.getElementById("userList").innerHTML = ''
    document.getElementById("lobbymessages").innerHTML += `${user.username} has joined the lobby, currently ${user.users.length == 1 ? ' 1 player' : `${user.users.length} players`} in lobby <br>`
    user.users.forEach(x=>document.getElementById("userList").innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center" id=${x}>${x}</li>`)  //<span class="badge badge-warning" id="${x}">waiting</span>
}); 

//send ready requests
let ready = (target) => {
    if (target.value == "true") {
        socket.emit('ready', false);
    } else {
        socket.emit('ready', true);
    }
}

//change ready status on button
socket.on('other player ready status changed', (user)=>{
    //show player is ready
    if (user.ready) {
        document.getElementById(user.username).style = "background-color: #B7E2C0; transition: 0.5s"
    } else {
        document.getElementById(user.username).style = "background-color:; transition: 0.5s"
    }
})

socket.on('player ready status changed', user => {
    if (user.ready) {
        document.getElementById("readyButton").value = "true"
        document.getElementById("readyButton").innerHTML = "unready"
        document.getElementById("readyButton").className = "mb-5 btn btn-warning"
        document.getElementById(user.username).style = "background-color: #B7E2C0; transition: 0.5s"
    } else {
        document.getElementById("readyButton").value = "false"
        document.getElementById("readyButton").innerHTML = "ready up"
        document.getElementById("readyButton").className = "mb-5 btn btn-success"
        document.getElementById(user.username).style = "background-color:; transition: 0.5s"
    }
})



//     if (user.ready) {
//         //if it was the user who readied
//         if (user.username == socket.username) {
//             document.getElementById("readyButton").value = "true"
//             document.getElementById("readyButton").innerHTML = "unready"
//             document.getElementById("readyButton").className = "mb-5 btn btn-warning"
//         }
//         //add is ready for all users
//         // document.getElementById(user.username).innerHTML = "ready"
//         // document.getElementById(user.username).className = "badge badge-success"
//         document.getElementById(user.username).style = "background-color: #B7E2C0; transition: 0.5s"
//     } else {
//         //if it was not the user who readied
//         if (user.username == socket.username) {
//             document.getElementById("readyButton").value = "true"
//             document.getElementById("readyButton").innerHTML = "ready up"
//             document.getElementById("readyButton").className = "mb-5 btn btn-success"
//         }
//         //remove is ready for all users
//         // document.getElementById(user.username).innerHTML = "waiting"
//         // document.getElementById(user.username).className = "badge badge-warning"
//         document.getElementById(user.username).style = "background-color:; transition: 0.5s"
//     }
// })

//send messages
const typeMessage = (event, location) => {
    if (event.message.value.length > 0) {
            socket.emit(`send message`, {
                message: event.message.value,
                username: socket.username,
                location: location,
                time: getTime()
            })
    }
}

//recieve messages from all users
socket.on('recieve message', message => {
    document.getElementById(`${message.location}messages`).innerHTML += `<span class="text-muted small">[${message.time}]</span> ${message.username}: ${message.message}<br>`
    document.getElementById(`${message.location}messageBox`).scrollTop = document.getElementById(`${message.location}messageBox`).scrollHeight
    document.getElementById(`${message.location}messagesInput`).value = ''
})


//all ready, starting game
socket.on('starting game', (startObj) => {
    if (!startObj.start) document.getElementById("lobbymessages").innerHTML += `Game starting in ${startObj.count}...<br>`
    document.getElementById("lobbymessageBox").scrollTop = document.getElementById("lobbymessageBox").scrollHeight
    if (startObj.start) {
        document.getElementById("lobbyPage").style.display = 'none'
        document.getElementById("gamePage").style.display = ''

        //fill messages
        startObj.chat.forEach((x, y)=>{
            console.log(`y = ${y} and len = ${startObj.chat.length}`)
            document.getElementById(`gamemessages`).innerHTML += `<span class="text-muted small">[${x.time}]</span> ${x.username}: ${x.message}<br>`
            if (y == startObj.chat.length-1) {
                document.getElementById(`gamemessageBox`).scrollTop = document.getElementById(`gamemessageBox`).scrollHeight
            }
        })

        startObj.users.forEach(x=>{
            console.log(startObj.users)
            console.log(x)
            if (x !== socket.username) {
                document.getElementById('otherPlayers').innerHTML += `
                <div id="${x}blindcards" class="player"></div>`
            }
            //deal form controles
            document.getElementById('dealSelect').innerHTML += `
            <li>
                <input type="submit" onclick="setDealOption(this)" class="form-control btn" name="submit" value="${x}" style="width: 100%">
            </li>`
        })
    }
})

//GAME PAGE

//request played card
const playCard = (card) => {
    let selectedCard = card.src.match(/(.{2})\.png$/)[1]
    socket.emit('request card played', {
        card: selectedCard,
        blind: false,
    })
    //this needs to be done through the server, atm cards just appear to player that played them
    document.getElementById("gameCards").innerHTML+= `<div class = "img-container"><img style="max-width:100%; height: auto;" src="${card.src}" onclick="playCard(this)"></img></div>`
    card.remove()
}

//response from played card
socket.on('deal cards reponse', reposnse => {

})


const setDealOption = (event) => {
    dealTo = event.value
}

//request to deal
const deal = (event) => {
    console.log('here')
    socket.emit('deal cards request', {
        number: event.number.value,
        to: dealTo
    })
}


//recieve delt hand
socket.on('hand delt', (result) => {
    if (!result.enoughCards) {
        console.log(`you've requested too many cards, there ${result.cardsLeft == 1 ? "is" : "are"} only ${result.cardsLeft} left`)
    } else {
        console.log(result)
        result.hand.forEach(x=> {
            document.getElementById('hand').innerHTML +=`<div class = "img-container"><img style="max-width:100%; height: auto;" src="${getCard(x.suit, x.value)}" onclick="playCard(this)"></img></div>`
        })
    }
});

//all players recieve notification about delt hand
socket.on('hand delt notification', (data)=>{
    console.log(`${data.from} has dealt ${data.number} cards to ${data.to.length >1 ? "all players" : data.to}`)

    //create blank cards for cards delt
    data.to.forEach(x=>{
        if (x !== socket.username) {
            console.log('x')
            document.getElementById(`${x}blindcards`).innerHTML += `<div class="img-container-blind"><img src="CardPics/blue_back.png"></img></div>`.repeat(data.number)
            // let childrenCount = document.getElementById(`${x}blindcards`).childElementCount
            // let widthNumber = 200/childrenCount*3
            // document.getElementsByClassName(`${x}img-container-blind`).width = `${widthNumber}px`
        }
    })
})
