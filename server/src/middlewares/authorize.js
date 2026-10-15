const ApiError = require('../utils/api-error');

function authorize(moduleCode, actionCode) {
  return (req, res, next) => {
    const permissions = req.user?.permissions || [];
    const allowed = permissions.some(
      (permission) =>
        permission.moduleCode === moduleCode && permission.actionCode === actionCode
    );

    if (!allowed) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }

    next();
  };
}

module.exports = authorize;
