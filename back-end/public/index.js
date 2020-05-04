var socket = io();
//const gameroom = io('/gameroom');

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

//responds to login attempt
socket.on('log in attempt response', response => {
    if (response.success === true) {
        socket.username = response.username
        document.getElementById("loginPage").style.display = 'none'
        document.getElementById("lobbyPage").style.display = ''
        document.getElementById("lobbyUsername").innerHTML = `${socket.username}`
    } else {
        if (!response.exists){
            console.log(`username doesnt exit`)
            document.getElementById('loginAlreadyLoggedIn').style.display = 'none'
            document.getElementById('loginInvalidPassword').style.display = 'none'
            document.getElementById('loginInvalidUsername').style.display = ''
        } else if (!response.password){
            console.log(`password inccorect`)
            document.getElementById('loginAlreadyLoggedIn').style.display = 'none'
            document.getElementById('loginInvalidUsername').style.display = 'none'
            document.getElementById('loginInvalidPassword').style.display = ''
        } else {
            console.log('user already logged in')
            document.getElementById('loginInvalidUsername').style.display = 'none'
            document.getElementById('loginInvalidPassword').style.display = 'none'
            document.getElementById('loginAlreadyLoggedIn').style.display = ''
        }
    }
})

const hide = (event) => {
    event.parentElement.style.display = "none"
}

//LOBBY PAGE

//redirect to lobby

socket.on('joined', (user) => {
    
})

//infrom userbase new user has joined

socket.on('new user joined', (user) => {
    document.getElementById("userList").innerHTML = ''
    document.getElementById("messages").innerHTML += `${user.username} has joined the lobby, currently ${Object.keys(user.users).length == 1 ? ' 1 player' : `${Object.keys(user.users).length} players`} in lobby <br>`
    Object.keys(user.users).forEach(x=>document.getElementById("userList").innerHTML += `${x} <span id="${x}"></span><br>`)
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

const typeMessage = event => {
    socket.emit('send lobby message', {
        message: event.message.value,
        username: socket.username
    })
}

socket.on('recieve lobby message', message => {
    document.getElementById("messages").innerHTML += `${message.username}: ${message.message}<br>`
    document.getElementById("messageBox").scrollTop = document.getElementById("messageBox").scrollHeight
    document.getElementById("messagesInput").value = ''
})

//change ready status on button
socket.on('ready status changed', (user)=>{
    if (user.ready) {
        //if it was the user who readied
        if (user.username == socket.username) {
            document.getElementById("readyButton").value = "true"
            document.getElementById("readyButton").innerHTML = "unready"
        }
        //add is ready for all users
        document.getElementById(user.username).innerHTML = "is ready"
    } else {
        //if it was not the user who readied
        if (user.username == socket.username) {
            document.getElementById("readyButton").value = "true"
            document.getElementById("readyButton").innerHTML = "ready up"
        }
        //remove is ready for all users
        document.getElementById(user.username).innerHTML = ""
    }
})

//all ready, starting game
socket.on('starting game', (startObj) => {
    if (!startObj.start) document.getElementById("messages").innerHTML += `Game starting in ${startObj.count}...<br>`
    document.getElementById("messageBox").scrollTop = document.getElementById("messageBox").scrollHeight
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

