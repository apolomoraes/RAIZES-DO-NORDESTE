const AppError = require("../../utils/AppError")
const { compare } = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const knex = require("../../infrastructure/database/knex")
const authConfig = require("../../configs/auth")

class AuthService {
  async create({ email, password }) {
    if (!email || !password) {
      throw new AppError("Preencha todos os campos")
    }

    const usuario = await knex("usuarios").where({ email }).first()
    if (!usuario) {
      throw new AppError("Email e/ou senha incorreta", 401)
    }

    const senhaCorreta = await compare(password, usuario.password)
    if (!senhaCorreta) {
      throw new AppError("Email e/ou senha incorreta", 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({ role: usuario.role }, secret, {
      subject: String(usuario.id),
      expiresIn
    })

    const { password: _, ...usuarioSemSenha } = usuario

    return { usuario: usuarioSemSenha, token }
  }
}

module.exports = AuthService