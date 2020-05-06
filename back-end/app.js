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

//import deck object, deal and shuffle functions
let deck = cards.Deck //deck of cards in order
let shuffle = cards.Shuffle //function to shuffle deck
let deal = cards.Deal //function to deal

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

//count the number of players that have readyd
var readyPlayers = 0;
//store some user info server side for less intensive access
var userList = {
};

//randomised deck of cards
let deckInPlay = shuffle(deck)

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
                        ready: false
                    }
                    //set db loggedin to true
                    Users.findOneAndUpdate({"username" : user.username}, {$set: {loggedIn: true}}, {returnNewDocument:true}).then(res => console.log(res))
                    
                    socket.isLoggedIn = true
                    socket.username = user.username
                    io.emit('new user joined', {
                        username: socket.username,
                        users: userList,
                    });
                    socket.emit('log in attempt response', {
                        success: true,
                        username: socket.username
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

    //handle ready requests from lobby
    socket.on('ready', async (username) => {
        //toggle user ready
        userList[username].ready = await !userList[username].ready
        //add or subtract from readyplayers
        userList[username].ready ? readyPlayers++ : readyPlayers--
        //add or remove from 'ready' room
        userList[username].ready == true ? socket.join('ready') : socket.leave('ready')
        // console.log(`${username} ready = ${users[username].ready}`)

        io.to('ready').emit(`joined`, username);
        io.emit('ready status changed', {
            username: username,
            ready: userList[username].ready,
        })
        let readyCount = 0;
        await Object.keys(userList).forEach(x => userList[x].ready && readyCount++)
        
        //if all players are ready and there is more than one player
        if (readyCount == Object.keys(userList).length){// to test with one user --> && Object.keys(users).length > 1) {
            console.log('starting game')
            let countDown = 5
            const count = setInterval( () => {
                console.log(countDown)
                //if a player unreadys, stop the countdown
                if (Object.keys(userList).length !== readyPlayers) {
                    clearInterval(count)
                } else {
                    io.to('ready').emit('starting game', {
                        count: countDown,
                        start: countDown == 0
                    })
                }
                countDown--
                if (countDown < 0) clearInterval(count)
            }, 1000)
        }
    })

    //lobby message box

    socket.on('send lobby message', message => {
        io.emit('recieve lobby message', message)
    })

    //test getting random card
    socket.on('deal cards', (msg) => {
        console.log(`request to deal from ${socket.username}`)
        socket.hand = deal(deckInPlay, 5)
        socket.emit('hand delt', {
            hand: socket.hand,
            cardsLeft: deckInPlay.length
        });
    });

    socket.on('disconnect', async () => {
        await delete userList[socket.username]
        socket.isLoggedIn == true && Users.findOneAndUpdate({"username" : socket.username}, {$set: {loggedIn: false}}, {returnNewDocument:true}).then(res => console.log(res))
        await console.log(`${socket.username} disconnected`);
      });
})
