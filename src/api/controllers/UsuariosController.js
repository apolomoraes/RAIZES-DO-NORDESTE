const UsuariosService = require("../../application/services/UsuariosService")

class UsuarioController {
  async create(req, res) {
    const { nome, email, password, role } = req.body
    const service = new UsuariosService()
    await service.create({ nome, email, password, role })
    return res.status(201).json({ message: "Usuário criado com sucesso" })
  }

  async show(req, res) {
    const { id } = req.params
    const service = new UsuariosService()
    const usuario = await service.show({ id: Number(id) })
    return res.status(200).json(usuario)
  }

  async update(req, res) {
    const { id } = req.params
    const { nome, email, password, old_password } = req.body
    const service = new UsuariosService()
    await service.update({ id: Number(id), nome, email, password, old_password })
    return res.status(200).json({ message: "Usuário atualizado com sucesso" })
  }
}
module.exports = UsuarioController