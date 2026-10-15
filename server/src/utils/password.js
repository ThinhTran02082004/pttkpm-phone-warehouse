const bcrypt = require('bcrypt');

async function hashPassword(plainText) {
  return bcrypt.hash(plainText, 10);
}

async function comparePassword(plainText, passwordHash) {
  return bcrypt.compare(plainText, passwordHash);
}

module.exports = {
  hashPassword,
  comparePassword,
};
