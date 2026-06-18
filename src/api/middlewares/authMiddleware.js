const AppError = require("../../utils/AppError")
const { verify } = require("jsonwebtoken")
const authConfig = require("../../configs/auth")

function authMiddleware(req, res, next) {
  const { authorization } = req.headers

  if (!authorization) {
    throw new AppError("Token não informado", 401)
  }

  const [, token] = authorization.split(" ")

  try {
    const { sub, role } = verify(token, authConfig.jwt.secret)
    req.user = {
      id: Number(sub),
      role
    }
    return next()
  } catch {
    throw new AppError("Token inválido", 401)
  }
}

module.exports = authMiddleware