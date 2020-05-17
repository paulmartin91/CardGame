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
        socket.username = response.username
        document.getElementById("loginPage").style.display = 'none'
        document.getElementById("lobbyPage").style.display = ''
        document.getElementById("lobbyUsername").innerHTML = `${socket.username}`
        document.getElementById("gameUsername").innerHTML = `${socket.username}`
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

//hides warning
const hide = (event) => {
    event.parentElement.style.display = "none"
}

//LOBBY PAGE

//redirect to lobby

socket.on('joined', (user) => {
    
})

//infrom userbase new user has joined
socket.on('new user joined', (user) => {
    console.log(user.users)
    document.getElementById("userList").innerHTML = ''
    document.getElementById("messages").innerHTML += `${user.username} has joined the lobby, currently ${Object.keys(user.users).length == 1 ? ' 1 player' : `${Object.keys(user.users).length} players`} in lobby <br>`
    Object.keys(user.users).forEach(x=>document.getElementById("userList").innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center" id=${x}>${x}</li>`)  //<span class="badge badge-warning" id="${x}">waiting</span>
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

//send messages
const typeMessage = event => {
    if (event.message.value.length > 0) {
        socket.emit('send lobby message', {
            message: event.message.value,
            username: socket.username
        })
    }
}

//recieve messages from all users
socket.on('recieve lobby message', message => {
    document.getElementById("messages").innerHTML += `<span class="text-muted small">[${getTime()}]</span> ${message.username}: ${message.message}<br>`
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
            document.getElementById("readyButton").className = "mb-5 btn btn-warning"
        }
        //add is ready for all users
        // document.getElementById(user.username).innerHTML = "ready"
        // document.getElementById(user.username).className = "badge badge-success"
        document.getElementById(user.username).style = "background-color: #B7E2C0; transition: 0.5s"
    } else {
        //if it was not the user who readied
        if (user.username == socket.username) {
            document.getElementById("readyButton").value = "true"
            document.getElementById("readyButton").innerHTML = "ready up"
            document.getElementById("readyButton").className = "mb-5 btn btn-success"
        }
        //remove is ready for all users
        // document.getElementById(user.username).innerHTML = "waiting"
        // document.getElementById(user.username).className = "badge badge-warning"
        document.getElementById(user.username).style = "background-color:; transition: 0.5s"
    }
})

//all ready, starting game
socket.on('starting game', (startObj) => {
    if (!startObj.start) document.getElementById("messages").innerHTML += `Game starting in ${startObj.count}...<br>`
    document.getElementById("messageBox").scrollTop = document.getElementById("messageBox").scrollHeight
    if (startObj.start) {
        document.getElementById("lobbyPage").style.display = 'none'
        document.getElementById("gamePage").style.display = ''
        Object.keys(startObj.users).forEach(x=>{
            console.log(startObj.users)
            console.log(x)
            if (x !== socket.username) {
                document.getElementById('gameBoard').innerHTML += `
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

//Play a card, send it to server
const playCard = (card) => {
    let cardObj = JSON.parse(card.value)
    console.log(`the ${cardObj.val} of ${cardObj.suit}`)
}

const setDealOption = (event) => {
    dealTo = event.value
}

//request to deal
const deal = (event) => {
    socket.emit('deal cards', {
        number: event.number.value,
        to: dealTo
    })
}

//recieve delt hand
socket.on('hand delt', function(result){
    console.log(result)
    result.hand.forEach(x=> {
        document.getElementById('hand').innerHTML +=`<div class = "img-container"><img style="max-width:100%; height: auto;" src="${getCard(x.suit, x.value)}" onclick="playCard(this)"></img></div>`
    })
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
