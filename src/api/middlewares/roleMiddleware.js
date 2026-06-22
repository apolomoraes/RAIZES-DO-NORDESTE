const AppError = require("../../utils/AppError")

function roleMiddleware(...rolesPermitidas) {
  return (req, res, next) => {
    const { role } = req.user

    if (!rolesPermitidas.includes(role)) {
      throw new AppError("Acesso negado", 403)
    }

    return next()
  }
}

module.exports = roleMiddleware