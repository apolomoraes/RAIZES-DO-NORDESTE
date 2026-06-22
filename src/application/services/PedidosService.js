const AppError = require("../../utils/AppError")
const knex = require("../../infrastructure/database/knex")

const CANAIS_VALIDOS = ["APP", "TOTEM", "BALCAO", "PICKUP", "WEB"]
const STATUS_VALIDOS = ["AGUARDANDO_PAGAMENTO", "EM_PREPARO", "PRONTO", "ENTREGUE", "CANCELADO"]

class PedidosService {
  async create({ cliente_id, unidade_id, canal_pedido, itens }) {
    if (!cliente_id || !unidade_id || !canal_pedido || !itens || itens.length === 0) {
      throw new AppError("Preencha todos os campos obrigatórios")
    }

    if (!CANAIS_VALIDOS.includes(canal_pedido)) {
      throw new AppError(`Canal inválido. Use: ${CANAIS_VALIDOS.join(", ")}`, 422)
    }

    const unidade = await knex("unidades").where({ id: unidade_id }).first()
    if (!unidade) {
      throw new AppError("Unidade não encontrada", 404)
    }

    let valor_total = 0
    const itensProntos = []

    for (const item of itens) {
      const { produto_id, quantidade } = item

      if (!produto_id || !quantidade || quantidade <= 0) {
        throw new AppError("Item inválido: produto_id e quantidade são obrigatórios")
      }

      const produto = await knex("produtos").where({ id: produto_id }).first()
      if (!produto) {
        throw new AppError(`Produto ${produto_id} não encontrado`, 404)
      }

      const vinculo = await knex("produtos_unidades")
        .where({ produto_id, unidade_id, disponivel: 1 })
        .first()
      if (!vinculo) {
        throw new AppError(`Produto ${produto.nome} não disponível nessa unidade`, 409)
      }

      const estoque = await knex("estoque")
        .where({ produto_id, unidade_id })
        .first()
      if (!estoque || estoque.quantidade < quantidade) {
        throw new AppError(`Estoque insuficiente para o produto ${produto.nome}`, 409)
      }

      valor_total += produto.preco * quantidade
      itensProntos.push({
        produto_id,
        quantidade,
        preco_unitario: produto.preco,
        estoque_id: estoque.id
      })
    }

    const [pedido_id] = await knex("pedidos").insert({
      cliente_id,
      unidade_id,
      canal_pedido,
      status: "AGUARDANDO_PAGAMENTO",
      valor_total
    })

    for (const item of itensProntos) {
      await knex("pedido_itens").insert({
        pedido_id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario
      })

      await knex("estoque")
        .where({ id: item.estoque_id })
        .update({
          quantidade: knex.raw("quantidade - ?", [item.quantidade]),
          updated_at: knex.fn.now()
        })

      await knex("movimentacoes_estoque").insert({
        estoque_id: item.estoque_id,
        tipo: "saida",
        quantidade: item.quantidade,
        motivo: `Pedido #${pedido_id}`
      })
    }

    await knex("logs_auditoria").insert({
      usuario_id: cliente_id,
      acao: "criar_pedido",
      entidade: "pedido",
      entidade_id: pedido_id,
      detalhes: JSON.stringify({ canal_pedido, valor_total, itens: itensProntos.length })
    })

    return { id: pedido_id, valor_total }
  }

  async index({ canal_pedido, status, unidade_id }) {
    const query = knex("pedidos").orderBy("created_at", "desc")

    if (canal_pedido) {
      if (!CANAIS_VALIDOS.includes(canal_pedido)) {
        throw new AppError(`Canal inválido. Use: ${CANAIS_VALIDOS.join(", ")}`, 422)
      }
      query.where({ canal_pedido })
    }

    if (status) {
      if (!STATUS_VALIDOS.includes(status)) {
        throw new AppError(`Status inválido. Use: ${STATUS_VALIDOS.join(", ")}`, 422)
      }
      query.where({ status })
    }

    if (unidade_id) {
      query.where({ unidade_id })
    }

    const pedidos = await query
    return pedidos
  }

  async show({ id }) {
    const pedido = await knex("pedidos").where({ id }).first()
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404)
    }

    const itens = await knex("pedido_itens")
      .join("produtos", "pedido_itens.produto_id", "produtos.id")
      .where("pedido_itens.pedido_id", id)
      .select(
        "pedido_itens.id",
        "pedido_itens.quantidade",
        "pedido_itens.preco_unitario",
        "produtos.id as produto_id",
        "produtos.nome"
      )

    return { ...pedido, itens }
  }

  async updateStatus({ id, status, usuario_id }) {
    if (!STATUS_VALIDOS.includes(status)) {
      throw new AppError(`Status inválido. Use: ${STATUS_VALIDOS.join(", ")}`, 422)
    }

    const pedido = await knex("pedidos").where({ id }).first()
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404)
    }

    if (pedido.status === "CANCELADO") {
      throw new AppError("Pedido cancelado não pode ter status alterado", 409)
    }

    if (pedido.status === "ENTREGUE") {
      throw new AppError("Pedido já entregue não pode ter status alterado", 409)
    }

    const status_anterior = pedido.status

    await knex("pedidos").where({ id }).update({
      status,
      updated_at: knex.fn.now()
    })

    await knex("logs_auditoria").insert({
      usuario_id,
      acao: "atualizar_status",
      entidade: "pedido",
      entidade_id: id,
      detalhes: JSON.stringify({ status_anterior, status_novo: status })
    })
  }

  async cancel({ id, usuario_id }) {
    const pedido = await knex("pedidos").where({ id }).first()
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404)
    }

    if (pedido.status === "CANCELADO") {
      throw new AppError("Pedido já está cancelado", 409)
    }

    if (pedido.status === "ENTREGUE") {
      throw new AppError("Pedido já entregue não pode ser cancelado", 409)
    }

    await knex("pedidos").where({ id }).update({
      status: "CANCELADO",
      updated_at: knex.fn.now()
    })

    await knex("logs_auditoria").insert({
      usuario_id,
      acao: "cancelar_pedido",
      entidade: "pedido",
      entidade_id: id,
      detalhes: JSON.stringify({ status_anterior: pedido.status })
    })
  }
}

module.exports = PedidosService