var socket = io();
//const gameroom = io('/gameroom');

//PAGE ROUTING

socket.on('redirect', (destination)=> {
    window.location.href = destination;
});

//LOGIN PAGE

// Sets the client's username
let setUsername = () => {
    socket.username = document.getElementById("usernameInput").value
    socket.emit('add user', socket.username);
}

//LOBBY PAGE

//redirect to lobby

socket.on('joined', (user) => {
    document.getElementById("loginPage").style.display = 'none'
    document.getElementById("lobbyPage").style.display = ''
    document.getElementById("lobbyUsername").innerHTML = socket.username
})

//infrom userbase new user has joined

socket.on('new user joined', (user) => {
    document.getElementById("userList").innerHTML = ''
    document.getElementById("messages").innerHTML += `${user.username} has joined the lobby, currently ${Object.keys(user.users).length == 1 ? ' 1 player' : `${Object.keys(user.users).length} players`} in lobby <br>`
    Object.keys(user.users).forEach(x=>document.getElementById("userList").innerHTML += `${x}<br>`)
});

socket.on('joined', (name)=>{console.log(`${name} is ready`)})

//send ready requests
let ready = (target) => {
    if (target.value == "true") {
        socket.emit('ready', socket.username);
    } else {
        socket.emit('ready', socket.username);
    }
}

//change ready status on button
socket.on('ready status changed', (ready)=>{
    if (!ready) {
        document.getElementById("readyButton").value = "false"
        document.getElementById("readyButton").innerHTML = "ready up"
    } else {
        document.getElementById("readyButton").value = "true"
        document.getElementById("readyButton").innerHTML = "unready"
    }
})

//all ready, starting game
socket.on('starting game', (startObj) => {
    if (!startObj.start) document.getElementById("messages").innerHTML += `Game starting in ${startObj.count}...<br>`
    if (startObj.start) {
        document.getElementById("lobbyPage").style.display = 'none'
        document.getElementById("gamePage").style.display = ''
    }
})

//GAME PAGE

//Play a card, send it to server
const playCard = (card) => {
    let cardObj = JSON.parse(card.value)
    console.log(`the ${cardObj.val} of ${cardObj.suit}`)
}

//request to deal
const deal = () => {
    socket.emit('deal cards')
}

//recieve delt hand
socket.on('hand delt', function(result){
    result.hand.forEach(x=> {
        let cardObj = JSON.stringify({"val": x.value, "suit": x.suit});
        document.getElementById('hand').innerHTML +=`<button value=${cardObj} onclick="playCard(this)">${x.value} of ${x.suit}</button>`
    })
});

