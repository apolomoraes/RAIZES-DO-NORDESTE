const PagamentoService = require("../../application/services/PagamentoService")

class PagamentoController {
  async solicitar(req, res) {
    const { pedido_id, forma_pagamento } = req.body
    const usuario_id = req.user.id
    const service = new PagamentoService()
    const resultado = await service.solicitar({ pedido_id, forma_pagamento, usuario_id })
    return res.status(200).json(resultado)
  }

  async show(req, res) {
    const { pedido_id } = req.params
    const service = new PagamentoService()
    const pagamento = await service.show({ pedido_id: Number(pedido_id) })
    return res.status(200).json(pagamento)
  }
}

module.exports = PagamentoController