const UnidadesService = require("../../application/services/UnidadesService")

class UnidadesController {
  async create(req, res) {
    const { nome, endereco, cidade, estado, tipo } = req.body
    const service = new UnidadesService()
    const { id } = await service.create({ nome, endereco, cidade, estado, tipo })
    return res.status(201).json({ message: "Unidade criada com sucesso", id })
  }

  async index(req, res) {
    const service = new UnidadesService()
    const unidades = await service.index()
    return res.status(200).json(unidades)
  }

  async show(req, res) {
    const { id } = req.params
    const service = new UnidadesService()
    const unidade = await service.show({ id: Number(id) })
    return res.status(200).json(unidade)
  }

  async update(req, res) {
    const { id } = req.params
    const { nome, endereco, cidade, estado, tipo } = req.body
    const service = new UnidadesService()
    await service.update({ id: Number(id), nome, endereco, cidade, estado, tipo })
    return res.status(200).json({ message: "Unidade atualizada com sucesso" })
  }
}

module.exports = UnidadesController