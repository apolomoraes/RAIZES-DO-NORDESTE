const EstoqueService = require("../../application/services/EstoqueService")

class EstoqueController {
  async entrada(req, res) {
    const { produto_id, unidade_id, quantidade, motivo } = req.body
    const service = new EstoqueService()
    await service.entrada({ produto_id, unidade_id, quantidade, motivo })
    return res.status(200).json({ message: "Entrada de estoque registrada com sucesso" })
  }

  async saida(req, res) {
    const { produto_id, unidade_id, quantidade, motivo } = req.body
    const service = new EstoqueService()
    await service.saida({ produto_id, unidade_id, quantidade, motivo })
    return res.status(200).json({ message: "Saída de estoque registrada com sucesso" })
  }

  async show(req, res) {
    const { unidade_id } = req.params
    const service = new EstoqueService()
    const estoque = await service.show({ unidade_id: Number(unidade_id) })
    return res.status(200).json(estoque)
  }
}

module.exports = EstoqueController