const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

//http requests
const auth = (req, res, next) => {
  //extract token from request header
  const token = req.header('x-auth-token');
  //if no token, 401
  if (!token) return res.status(401).send('Access denied. No token provided.')
  try {
    //check token from token stored in config
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
    //store decoded jwt in request
    req.user = decoded;
    next();
  } catch (ex) {
    //send 400 for invalid token
    res.status(400).send('Invalid token.')
  }
}

const socketAuth = async (socket, next) => {
  //first connection doesn't contain this object, client side issue
  if (!socket.handshake) return
  //check to see if token is supplied
  const token = await socket.handshake.auth.token
  //return socket.emit('Access denied. No token provided.')
  if (!token) return console.log('no token')
  try {
    //decode JWT
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
    //see user connected
    console.log(decoded.username, 'has connected')
    // const isLoggedIn = await User.findOne({username: [decoded.username]})
    // console.log(isLoggedIn)
    //save user in the socket object
    socket.user = decoded
    
    next()
  } catch (error) {
    //cath invalid token errors
    console.log(error)
    return
  }
}

exports.auth = auth
exports.socketAuth = socketAuth