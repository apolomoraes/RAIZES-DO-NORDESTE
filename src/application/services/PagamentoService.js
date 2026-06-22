const AppError = require("../../utils/AppError")
const knex = require("../../infrastructure/database/knex")

const FORMAS_PAGAMENTO_VALIDAS = ["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "DINHEIRO"]

class PagamentoService {
  #mockGateway({ forma_pagamento, valor }) {
    const aprovado = Math.random() > 0.2

    return {
      transacao_id: `TXN-${Date.now()}`,
      forma_pagamento,
      valor,
      status: aprovado ? "APROVADO" : "RECUSADO",
      mensagem: aprovado ? "Pagamento aprovado" : "Pagamento recusado pela operadora",
      timestamp: new Date().toISOString()
    }
  }

  async solicitar({ pedido_id, forma_pagamento, usuario_id }) {
    if (!pedido_id || !forma_pagamento) {
      throw new AppError("Preencha todos os campos obrigatórios")
    }

    if (!FORMAS_PAGAMENTO_VALIDAS.includes(forma_pagamento)) {
      throw new AppError(`Forma de pagamento inválida. Use: ${FORMAS_PAGAMENTO_VALIDAS.join(", ")}`, 422)
    }

    const pedido = await knex("pedidos").where({ id: pedido_id }).first()
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404)
    }

    if (pedido.status !== "AGUARDANDO_PAGAMENTO") {
      throw new AppError("Pedido não está aguardando pagamento", 409)
    }

    const pagamentoExiste = await knex("pagamentos")
      .where({ pedido_id, status: "APROVADO" })
      .first()
    if (pagamentoExiste) {
      throw new AppError("Pedido já possui pagamento aprovado", 409)
    }

    const respostaMock = this.#mockGateway({
      forma_pagamento,
      valor: pedido.valor_total
    })

    const [pagamento_id] = await knex("pagamentos").insert({
      pedido_id,
      forma_pagamento,
      status: respostaMock.status,
      payload: JSON.stringify(respostaMock)
    })

    if (respostaMock.status === "APROVADO") {
      await knex("pedidos").where({ id: pedido_id }).update({
        status: "EM_PREPARO",
        updated_at: knex.fn.now()
      })

      await knex("logs_auditoria").insert({
        usuario_id,
        acao: "pagamento_aprovado",
        entidade: "pagamento",
        entidade_id: pagamento_id,
        detalhes: JSON.stringify({
          pedido_id,
          transacao_id: respostaMock.transacao_id,
          valor: pedido.valor_total
        })
      })

      const FidelidadeService = require("./FidelidadeService")
      const fidelidadeService = new FidelidadeService()
      await fidelidadeService.registrar({
        cliente_id: pedido.cliente_id,
        pedido_id,
        valor_total: pedido.valor_total
      })
    }

    return {
      pagamento_id,
      status: respostaMock.status,
      mensagem: respostaMock.mensagem,
      transacao_id: respostaMock.transacao_id,
      pedido_status: respostaMock.status === "APROVADO" ? "EM_PREPARO" : "AGUARDANDO_PAGAMENTO"
    }
  }

  async show({ pedido_id }) {
    const pagamento = await knex("pagamentos")
      .where({ pedido_id })
      .orderBy("created_at", "desc")
      .first()

    if (!pagamento) {
      throw new AppError("Pagamento não encontrado", 404)
    }

    return {
      ...pagamento,
      payload: JSON.parse(pagamento.payload)
    }
  }
}

module.exports = PagamentoService