const jwt = require('jsonwebtoken')

function parseToken(token) {
  if (!token || token.length < 1) return
  return jwt.verify(token?.replaceAll("Bearer ", ""), getSecretKey())
}

function getSecretKey() {
  return "mySecretKey1234%^&*"
}

// Generate login token
function createToken(userID, mail) {
  return jwt.sign({mataikhoan: userID, mail}, getSecretKey());
}

module.exports = {createToken, parseToken, getSecretKey}