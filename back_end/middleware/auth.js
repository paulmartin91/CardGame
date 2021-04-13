const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function auth(req, res, next) {
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