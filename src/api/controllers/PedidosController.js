const PedidosService = require("../../application/services/PedidosService")

class PedidosController {
  async create(req, res) {
    const { unidade_id, canal_pedido, itens } = req.body
    const cliente_id = req.user.id
    const service = new PedidosService()
    const { id, valor_total } = await service.create({ cliente_id, unidade_id, canal_pedido, itens })
    return res.status(201).json({ message: "Pedido criado com sucesso", id, valor_total })
  }

  async index(req, res) {
    const { canal_pedido, status, unidade_id } = req.query
    const service = new PedidosService()
    const pedidos = await service.index({ canal_pedido, status, unidade_id })
    return res.status(200).json(pedidos)
  }

  async show(req, res) {
    const { id } = req.params
    const service = new PedidosService()
    const pedido = await service.show({ id: Number(id) })
    return res.status(200).json(pedido)
  }

  async updateStatus(req, res) {
    const { id } = req.params
    const { status } = req.body
    const usuario_id = req.user.id
    const service = new PedidosService()
    await service.updateStatus({ id: Number(id), status, usuario_id })
    return res.status(200).json({ message: "Status atualizado com sucesso" })
  }

  async cancel(req, res) {
    const { id } = req.params
    const usuario_id = req.user.id
    const service = new PedidosService()
    await service.cancel({ id: Number(id), usuario_id })
    return res.status(200).json({ message: "Pedido cancelado com sucesso" })
  }
}

module.exports = PedidosController