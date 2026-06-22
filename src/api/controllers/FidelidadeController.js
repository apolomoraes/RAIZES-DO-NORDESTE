const FidelidadeService = require("../../application/services/FidelidadeService")

class FidelidadeController {
  async saldo(req, res) {
    const cliente_id = req.user.id
    const service = new FidelidadeService()
    const resultado = await service.saldo({ cliente_id })
    return res.status(200).json(resultado)
  }

  async historico(req, res) {
    const cliente_id = req.user.id
    const service = new FidelidadeService()
    const historico = await service.historico({ cliente_id })
    return res.status(200).json(historico)
  }

  async resgatar(req, res) {
    const cliente_id = req.user.id
    const { pontos } = req.body
    const service = new FidelidadeService()
    const resultado = await service.resgatar({ cliente_id, pontos })
    return res.status(200).json(resultado)
  }

  async registrarConsentimento(req, res) {
    const cliente_id = req.user.id
    const { finalidade, aceito } = req.body
    const service = new FidelidadeService()
    await service.registrarConsentimento({ cliente_id, finalidade, aceito })
    return res.status(200).json({ message: "Consentimento registrado com sucesso" })
  }
}

module.exports = FidelidadeController