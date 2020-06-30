const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

server.listen(8000, function () {
    console.log('Your app is listening on port ' + server.address().port);
  });

app.use(express.static('public'))

//import card object
var cards = require('./cards.js');

//websocket
var socket = require('socket.io')

//mongoose init
//process.env.MONGO_URI = PUT MONGO URI HERE;
process.env.MONGO_URI = 'mongodb://localhost:27017'

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client)=>{
    if (err){console.log(err)} else {console.log('mongo db connected')}
    return;
  });

//mongodb schemas
//user schema
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    loggedIn: Boolean
});

var Users = mongoose.model("users", userSchema);

//store some user info server side for less intensive access
var userList = {
};
//store active games
var gameList = {

};

//import deck object, deal and shuffle functions
let deck = cards.Deck //deck of cards in order
let shuffle = cards.Shuffle //function to shuffle deck
let deal = cards.Deal //function to deal

//logout all users
Users.updateMany({}, {$set: {loggedIn: false}}, {returnNewDocument:true}).then(res => console.log(res))

//on connection
io.sockets.on('connection', (socket) => {
    //log user connected on server
    console.log("a user connected")

    //test
    socket.on('gameroom', room => {
        console.log(room)
        socket.join(room)
        setTimeout(()=>console.log(io.sockets.adapter.rooms), 2000)
    })

    //LOGIN PAGE

    //request to log in
    socket.on('login attempt',  (user) => {
        Users.findOne({username: user.username}, (err, instance) => {
            if (err) console.log(err)
            //doesn't exist
            if (instance === null) {
                socket.emit('log in attempt response', {
                    exists: false,
                    password: null,
                    alreadyLoggedIn: null
                })
            } else {
                //all valid
                if (instance.password == user.password && !instance.loggedIn) {
                    userList[user.username] = {
                        ready: false,
                        userId: socket.id,
                    }
                    //set db loggedin to true
                    Users.findOneAndUpdate({"username" : user.username}, {$set: {loggedIn: true}}, {returnNewDocument:true}).then(res => console.log(res))
                    
                    socket.isLoggedIn = true
                    socket.username = user.username
                    socket.emit('log in attempt response', {
                        success: true,
                        username: socket.username,
                        gameList: gameList
                    })
                } else {
                    socket.emit('log in attempt response', {
                        exists: true,
                        password: instance.password == user.password,
                        alreadyLoggedIn: instance.loggedIn
                    })
                }
            }
        })
    });

    socket.on('new user request', async (user) => {
        //check if username exists
        const checkExistingUser = await Users.find({username: user.username}, async (err, response) => {
            if (err) console.log(err)
            //if it doesn't...
            if (response.length === 0) {
                //check if email exists
                const checkExistingEmail = await Users.find({email: user.email}, async (err, response) => {
                    if (err) console.log(err)
                    //if it doesn't...
                    if (response.length === 0) {
                        //create new user
                        const createNewUser = await Users.create({
                            username: user.username,
                            password: user.password,
                            email: user.email,
                            loggedIn: false
                        }, (err, instance) => {
                            if (err) console.log(err)
                            socket.emit('new user response', {
                                success: true,
                                user: instance
                            })
                        })
                    } else {
                        socket.emit('new user response', {
                            success: false,
                            reason: 'Email address already exists'
                        })
                    }
                })
            } else {
                socket.emit('new user response', {
                    success: false,
                    reason: 'Username already exists'
                })
            }
        })
    })

    //GAME BROWSE PAGE

    //refresh game list

    socket.on('request refresh games', ()=>{
        socket.emit('response refresh games', {
            gameList: gameList
        })
    })

    //create a game
    socket.on('request create new game', request => {
        //name taken
        if (request.name in gameList) {
            socket.emit('response create new game', {
                exists: true,
                name: request.name
            })
            //create new game
        } else {
            gameList[request.name] = {
                maxPlayers: 6,
                password: request.password == '' ? false : request.password,
                currentPlayers: 1,
                name: request.name,
                playerList: [socket.username]
            }

            socket.gameName = request.name
            socket.join(request.name);
            io.sockets.adapter.rooms[request.name].players = [socket.username]
            io.sockets.adapter.rooms[request.name].playersIds = {[socket.username]: socket.id}
            io.sockets.adapter.rooms[request.name].deckInPlay = shuffle(Array.from(cards.Deck))
            io.sockets.adapter.rooms[request.name].readyPlayers = 0
            io.sockets.adapter.rooms[request.name].chat = []
            socket.emit('response create new game', {
                exists: false,
                name: request.name
            })
            setTimeout(()=>{
                io.to(request.name).emit('new user joined game', {
                    username: socket.username,
                    users: io.sockets.adapter.rooms[request.name].players,
                });
             }, 200)
        }
    })

    //join a game
    socket.on('join game request', async request => {
        if (!request.name in gameList) {
            console.log('game doesnt exist')
        } else if (gameList[request.name].currentPlayers >= gameList[request.name].maxPlayers) {
            console.log('game is full')
        } else {
            if (gameList[request.name].password) {
                if (request.password == gameList[request.name].password) {
                    //join successful
                    socket.gameName = request.name
                    await gameList[request.name].playerList.push(socket.username)
                    await socket.join(request.name);
                    await io.sockets.adapter.rooms[request.name].players.push(socket.username)
                    io.sockets.adapter.rooms[request.name].playersIds[socket.username] = socket.id
                    setTimeout(()=> {
                        io.to(request.name).emit('new user joined game', {
                            username: socket.username,
                            users: io.sockets.adapter.rooms[request.name].players,
                        });
                    }, 200)
                    socket.emit('join game response', {
                        success: true,
                        name: request.name
                    })
                } else {
                    console.log('password incorrect')
                    console.log(request.password)
                }
            } else {
            console.log('game has no password')
                //join successful
                socket.gameName = request.name
                await gameList[request.name].playerList.push(socket.username)
                await socket.join(request.name);
                await io.sockets.adapter.rooms[request.name].players.push(socket.username)
                io.sockets.adapter.rooms[request.name].playersIds[socket.username] = socket.id
                setTimeout(()=> {
                    console.log(`players = ${io.sockets.adapter.rooms[request.name].players}`)
                    console.log(`playerList = ${gameList[request.name].playerList}`)
                    io.to(request.name).emit('new user joined game', {
                        username: socket.username,
                        users: io.sockets.adapter.rooms[request.name].players,
                    });
                }, 200)
                socket.emit('join game response', {
                    success: true,
                    name: request.name
                })
            }
        }
    })


    //LOBBY

    //handle ready requests from lobby
    socket.on('ready', async isReady => {
        //toggle user ready
        userList[socket.username].ready = await isReady
        //add or subtract from readyplayers
        isReady ? io.sockets.adapter.rooms[socket.gameName].readyPlayers++ : io.sockets.adapter.rooms[socket.gameName].readyPlayers--
        //add or remove from 'ready' room
        // userList[username].ready == true ? socket.join('ready') : socket.leave('ready')
        // console.log(`${username} ready = ${users[username].ready}`)

        console.log(socket.username)
        console.log(socket.gameName)

        socket.to(socket.gameName).emit('other player ready status changed', {
            username: socket.username,
            ready: isReady,
        });

        socket.emit('player ready status changed', {
            username: socket.username,
            ready: isReady,
        })

        console.log(`number of ready players = ${io.sockets.adapter.rooms[socket.gameName].readyPlayers}`)
        console.log(`number of players = ${io.sockets.adapter.rooms[socket.gameName].length}`)

        //if all players are ready and there is more than one player
        if (io.sockets.adapter.rooms[socket.gameName].readyPlayers == io.sockets.adapter.rooms[socket.gameName].length){// to test with one user --> && Object.keys(users).length > 1) {
            console.log('starting game')
            let countDown = 1 //<-- 1 for dev stage, 5 in production
            const count = setInterval( () => {
                console.log(io.sockets.adapter.rooms[socket.gameName].players)
                //if a player unreadys, stop the countdown
                if (io.sockets.adapter.rooms[socket.gameName].length !== io.sockets.adapter.rooms[socket.gameName].readyPlayers) {
                    clearInterval(count)
                } else {
                    io.to(socket.gameName).emit('starting game', {
                        count: countDown,
                        start: countDown == 0,
                        users: io.sockets.adapter.rooms[socket.gameName].players,
                        chat: io.sockets.adapter.rooms[socket.gameName].chat
                    })
                }
                countDown--
                if (countDown < 0) clearInterval(count)
            }, 1000)
        }
    })

    //lobby message box

    socket.on('send message', message => {
        io.sockets.adapter.rooms[socket.gameName].chat.push({
            message: message.message,
            username: message.username,
            time: message.time
        })
        io.emit('recieve message', message)
    })

    //game mechanics

    //import deck object, deal and shuffle functions
    let deck = cards.Deck //deck of cards in order
    let shuffle = cards.Shuffle //function to shuffle deck
    let deal = cards.Deal //function to deal

    //randomised deck of cards
    // let deckInPlay = shuffle(deck)

    //play cards
    socket.on('request card played', request => {
        // card: selectedCard,
        // blind: false
        console.log(socket.gameName)
        io.to(socket.gameName).emit('response card played', {
            player: socket.username,
            card: request.card,
            cardSrc: request.cardSrc,
            blind: request.blind
        })
        socket.to(socket.gameName).emit('response es card played', socket.username)

        console.log(`${socket.username} just played a ${request.card} in ${socket.gameName}`)
    })

    //deal cards
    socket.on('deal cards request', async request => {

        console.log(`request to deal from ${socket.username} to ${request.to}`)

        let cardsRequested = await request.to == "All" ? (request.number * io.sockets.adapter.rooms[socket.gameName].length) : request.number

        //if user requested more cards than deck has available
        if (cardsRequested > io.sockets.adapter.rooms[socket.gameName].deckInPlay.length) {
            io.in(socket.gameName).emit('hand delt', {
                enoughCards: false,
                cardsLeft: io.sockets.adapter.rooms[socket.gameName].deckInPlay.length,
                number: request.number
            })
        } else {
            //to all players
            if (request.to === "All") {
                let cardsLeft = await io.sockets.adapter.rooms[socket.gameName].deckInPlay.length - (io.sockets.adapter.rooms[socket.gameName].players.length * request.number)
                io.sockets.adapter.rooms[socket.gameName].players.forEach(username =>{
                    io.to(io.sockets.adapter.rooms[socket.gameName].playersIds[username]).emit('hand delt', {
                        hand: deal(io.sockets.adapter.rooms[socket.gameName].deckInPlay, request.number),
                        cardsLeft: cardsLeft,
                        enoughCards: true
                    });
                })
                io.in(socket.gameName).emit('hand delt notification', {
                    number: request.number,
                    from: socket.username,
                    to: Object.keys(userList)
                })
            } else {
                //to one player
                let cardsLeft = await io.sockets.adapter.rooms[socket.gameName].deckInPlay.length - (io.sockets.adapter.rooms[socket.gameName].players.length * request.number)
                io.to(io.sockets.adapter.rooms[socket.gameName].playersIds[request.to]).emit('hand delt', {
                    hand: deal(io.sockets.adapter.rooms[socket.gameName].deckInPlay, request.number),
                    cardsLeft: cardsLeft,
                    enoughCards: true
                });
                io.in(socket.gameName).emit('hand delt notification', {
                    number: request.number,
                    from: socket.username,
                    to: [request.to]
                })
            }
        }
    });

    
    socket.on('disconnect', async () => {
        await delete userList[socket.username]
        if (socket.isLoggedIn == true){
            Users.findOneAndUpdate({"username" : socket.username}, {$set: {loggedIn: false}}, {returnNewDocument:true}).then(res => console.log(res))
        }
        await console.log(`${socket.username} disconnected`);
      });
})
