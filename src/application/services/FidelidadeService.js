const AppError = require("../../utils/AppError")
const knex = require("../../infrastructure/database/knex")

const PONTOS_POR_REAL = 1
const MINIMO_RESGATE = 100

class FidelidadeService {
  async registrar({ cliente_id, pedido_id, valor_total }) {
    const consentimento = await knex("consentimentos_lgpd")
      .where({ cliente_id, finalidade: "programa_fidelidade", aceito: 1 })
      .first()

    if (!consentimento) return

    const fidelidade = await knex("fidelidade")
      .where({ cliente_id })
      .first()

    const pontos_ganhos = Math.floor(valor_total * PONTOS_POR_REAL)

    if (fidelidade) {
      await knex("fidelidade").where({ cliente_id }).update({
        pontos: fidelidade.pontos + pontos_ganhos,
        updated_at: knex.fn.now()
      })
    } else {
      await knex("fidelidade").insert({
        cliente_id,
        pontos: pontos_ganhos
      })
    }

    await knex("fidelidade_historico").insert({
      cliente_id,
      pedido_id,
      tipo: "acumulo",
      pontos: pontos_ganhos
    })
  }

  async saldo({ cliente_id }) {
    const consentimento = await knex("consentimentos_lgpd")
      .where({ cliente_id, finalidade: "programa_fidelidade", aceito: 1 })
      .first()

    if (!consentimento) {
      throw new AppError("Cliente não possui consentimento para o programa de fidelidade", 403)
    }

    const fidelidade = await knex("fidelidade").where({ cliente_id }).first()
    if (!fidelidade) {
      return { cliente_id, pontos: 0 }
    }

    return { cliente_id, pontos: fidelidade.pontos }
  }

  async historico({ cliente_id }) {
    const consentimento = await knex("consentimentos_lgpd")
      .where({ cliente_id, finalidade: "programa_fidelidade", aceito: 1 })
      .first()

    if (!consentimento) {
      throw new AppError("Cliente não possui consentimento para o programa de fidelidade", 403)
    }

    const historico = await knex("fidelidade_historico")
      .where({ cliente_id })
      .orderBy("created_at", "desc")

    return historico
  }

  async resgatar({ cliente_id, pontos }) {
    if (!pontos || pontos <= 0) {
      throw new AppError("Informe uma quantidade válida de pontos")
    }

    if (pontos < MINIMO_RESGATE) {
      throw new AppError(`O mínimo para resgate é ${MINIMO_RESGATE} pontos`)
    }

    const consentimento = await knex("consentimentos_lgpd")
      .where({ cliente_id, finalidade: "programa_fidelidade", aceito: 1 })
      .first()

    if (!consentimento) {
      throw new AppError("Cliente não possui consentimento para o programa de fidelidade", 403)
    }

    const fidelidade = await knex("fidelidade").where({ cliente_id }).first()
    if (!fidelidade || fidelidade.pontos < pontos) {
      throw new AppError("Saldo de pontos insuficiente", 409)
    }

    await knex("fidelidade").where({ cliente_id }).update({
      pontos: fidelidade.pontos - pontos,
      updated_at: knex.fn.now()
    })

    await knex("fidelidade_historico").insert({
      cliente_id,
      pedido_id: null,
      tipo: "resgate",
      pontos
    })

    return { pontos_resgatados: pontos, saldo_restante: fidelidade.pontos - pontos }
  }

  async registrarConsentimento({ cliente_id, finalidade, aceito }) {
    if (!finalidade) {
      throw new AppError("Informe a finalidade do consentimento")
    }

    const consentimentoExiste = await knex("consentimentos_lgpd")
      .where({ cliente_id, finalidade })
      .first()

    if (consentimentoExiste) {
      await knex("consentimentos_lgpd")
        .where({ cliente_id, finalidade })
        .update({ aceito: aceito ? 1 : 0 })
    } else {
      await knex("consentimentos_lgpd").insert({
        cliente_id,
        finalidade,
        aceito: aceito ? 1 : 0
      })
    }
  }
}

module.exports = FidelidadeService

module.exports = FidelidadeService