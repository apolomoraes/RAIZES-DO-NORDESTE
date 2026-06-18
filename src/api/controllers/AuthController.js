const AuthService = require("../../application/services/AuthService")
class AuthController {
  async create(req, res) {
    const { email, password } = req.body
    const service = new AuthService()
    const { usuario, token } = await service.create({ email, password })
    return res.status(200).json({ usuario, token })
  }
}
module.exports = AuthController