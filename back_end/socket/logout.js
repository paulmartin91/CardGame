const {User} = require('../models/user')

const handleLogout = async (username) => {
  const user = await User.findOneAndUpdate({ username: username }, {isLoggedIn: false})
  console.log(user)
}

const logoutAllUsers = async (io) => {
  await User.updateMany({}, {isLoggedIn: false})
  console.log('all users have been logged out')
  io.emit('server_restart')
}

module.exports = {
  handleLogout,
  logoutAllUsers 
}