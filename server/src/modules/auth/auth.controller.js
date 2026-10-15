const authService = require('./auth.service');

async function login(req, res) {
  const { username, password } = req.body;
  const data = await authService.login(username, password);

  res.json({
    success: true,
    data,
  });
}

async function me(req, res) {
  res.json({
    success: true,
    data: req.user,
  });
}

async function logout(req, res) {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}

module.exports = {
  login,
  me,
  logout,
};
