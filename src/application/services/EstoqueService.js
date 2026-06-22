const AppError = require("../../utils/AppError")
const knex = require("../../infrastructure/database/knex")

class EstoqueService {
  async entrada({ produto_id, unidade_id, quantidade, motivo }) {
    if (!produto_id || !unidade_id || !quantidade) {
      throw new AppError("Preencha todos os campos obrigatórios")
    }

    if (quantidade <= 0) {
      throw new AppError("A quantidade deve ser maior que zero")
    }

    const produto = await knex("produtos").where({ id: produto_id }).first()
    if (!produto) {
      throw new AppError("Produto não encontrado", 404)
    }

    const unidade = await knex("unidades").where({ id: unidade_id }).first()
    if (!unidade) {
      throw new AppError("Unidade não encontrada", 404)
    }

    const estoqueExiste = await knex("estoque")
      .where({ produto_id, unidade_id })
      .first()

    if (estoqueExiste) {
      await knex("estoque")
        .where({ produto_id, unidade_id })
        .update({
          quantidade: estoqueExiste.quantidade + quantidade,
          updated_at: knex.fn.now()
        })

      await knex("movimentacoes_estoque").insert({
        estoque_id: estoqueExiste.id,
        tipo: "entrada",
        quantidade,
        motivo: motivo ?? null
      })
    } else {
      const [estoque_id] = await knex("estoque").insert({
        produto_id,
        unidade_id,
        quantidade
      })

      await knex("movimentacoes_estoque").insert({
        estoque_id,
        tipo: "entrada",
        quantidade,
        motivo: motivo ?? null
      })
    }
  }

  async saida({ produto_id, unidade_id, quantidade, motivo }) {
    if (!produto_id || !unidade_id || !quantidade) {
      throw new AppError("Preencha todos os campos obrigatórios")
    }

    if (quantidade <= 0) {
      throw new AppError("A quantidade deve ser maior que zero")
    }

    const estoque = await knex("estoque")
      .where({ produto_id, unidade_id })
      .first()

    if (!estoque) {
      throw new AppError("Estoque não encontrado para esse produto/unidade", 404)
    }

    if (estoque.quantidade < quantidade) {
      throw new AppError("Estoque insuficiente", 409)
    }

    await knex("estoque")
      .where({ produto_id, unidade_id })
      .update({
        quantidade: estoque.quantidade - quantidade,
        updated_at: knex.fn.now()
      })

    await knex("movimentacoes_estoque").insert({
      estoque_id: estoque.id,
      tipo: "saida",
      quantidade,
      motivo: motivo ?? null
    })
  }

  async show({ unidade_id }) {
    const unidade = await knex("unidades").where({ id: unidade_id }).first()
    if (!unidade) {
      throw new AppError("Unidade não encontrada", 404)
    }

    const estoque = await knex("estoque")
      .join("produtos", "estoque.produto_id", "produtos.id")
      .where("estoque.unidade_id", unidade_id)
      .select(
        "estoque.id",
        "estoque.quantidade",
        "produtos.id as produto_id",
        "produtos.nome",
        "produtos.categoria"
      )
      .orderBy("produtos.nome")

    return estoque
  }
}

module.exports = EstoqueService