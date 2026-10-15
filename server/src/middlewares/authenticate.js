const ApiError = require('../utils/api-error');
const { verifyAccessToken } = require('../utils/jwt');
const authService = require('../modules/auth/auth.service');

async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';

    if (!authorization.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token is required');
    }

    const token = authorization.replace('Bearer ', '').trim();
    const payload = verifyAccessToken(token);
    const currentUser = await authService.getCurrentUserByAccountId(payload.accountId);

    if (!currentUser || currentUser.account.status !== 'active') {
      throw new ApiError(401, 'Account is not available');
    }

    req.user = currentUser;
    req.auth = payload;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticate;
