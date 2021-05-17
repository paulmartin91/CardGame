const {User} = require('../models/user')

module.exports = async function logout(username){
  const user = await User.findOneAndUpdate({ username: username }, {isLoggedIn: false})
  console.log(user)
}