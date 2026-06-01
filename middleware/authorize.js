const { UnauthorizedError, ForbiddenError } = require("../errors");

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("You do not have permission to perform this action");
    }

    next();
  };
}

module.exports = authorize;