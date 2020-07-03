const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//mongoose init
//process.env.MONGO_URI = PUT MONGO URI HERE;
process.env.MONGO_URI = 'mongodb://localhost:27017'

mongoose.set('useFindAndModify', false);

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

//info on server
var userList = {}; //might not need this?
var gameList = {};

//Socket Conection Start
io.on('connection', socket => {
    
    console.log(`we have a new connection!`)

      //request to log in
      socket.on('login attempt',  user => {
          console.log('yes')
        Users.findOne({username: user.username}, (err, instance) => {
            if (err) console.log(err)
            //doesn't exist
            if (instance === null) {
                console.log('here')
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
                    
                    socket.isLoggedIn = true //Can I get rid of this?
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

    //Create New User Request
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
                                username: user.username
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
    

})

server.listen(PORT, ()=> console.log(`server has started on port ${PORT}`))