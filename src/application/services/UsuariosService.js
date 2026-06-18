const AppError = require("../../utils/AppError")
const { hash, compare } = require("bcryptjs")
const knex = require("../../infrastructure/database/knex")
class UsuariosService {
  async create({ nome, email, password, role }) {
    if (!nome || !email || !password) {
      throw new AppError("Preencha todos os campos")
    }
    if (password.length < 6) {
      throw new AppError("A senha deve ter no mínimo 6 caracteres")
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError("Endereço de e-mail inválido")
    }

    const rolesValidas = ["cliente", "atendente", "cozinha", "gerente", "admin"]
    if (role && !rolesValidas.includes(role)) {
      throw new AppError("Role inválida")
    }

    const emailExiste = await knex("usuarios").where({ email }).first()
    if (emailExiste) {
      throw new AppError("Este e-mail já está em uso")
    }

    const senhaHash = await hash(password, 8)

    await knex("usuarios").insert({
      nome,
      email,
      password: senhaHash,
      role: role ?? "cliente"
    })
  }

  async show({ id }) {
    const usuario = await knex("usuarios").where({ id }).first()
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404)
    }

    const { password, ...usuarioSemSenha } = usuario
    return usuarioSemSenha
  }

  async update({ id, nome, email, password, old_password }) {
    const usuario = await knex("usuarios").where({ id }).first()
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404)
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new AppError("Endereço de e-mail inválido")
      }

      const emailEmUso = await knex("usuarios").where({ email }).first()
      if (emailEmUso && emailEmUso.id !== id) {
        throw new AppError("Este e-mail já está em uso")
      }
    }

    if (password && !old_password) {
      throw new AppError("Informe a senha antiga para alterar a senha")
    }

    let senhaHash = usuario.password
    if (password && old_password) {
      const senhaCorreta = await compare(old_password, usuario.password)
      if (!senhaCorreta) {
        throw new AppError("Senha antiga incorreta")
      }
      senhaHash = await hash(password, 8)
    }

    await knex("usuarios").where({ id }).update({
      nome: nome ?? usuario.nome,
      email: email ?? usuario.email,
      password: senhaHash,
      updated_at: knex.fn.now()
    })
  }
}

module.exports = UsuariosService