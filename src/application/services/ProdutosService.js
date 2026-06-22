const AppError = require("../../utils/AppError")
const knex = require("../../infrastructure/database/knex")

class ProdutosService {
  async create({ nome, descricao, preco, categoria, disponivel_junino, unidades }) {
    if (!nome || !preco || !categoria) {
      throw new AppError("Preencha todos os campos obrigatórios")
    }

    if (preco <= 0) {
      throw new AppError("O preço deve ser maior que zero")
    }

    const [produto_id] = await knex("produtos").insert({
      nome,
      descricao,
      preco,
      categoria,
      disponivel_junino: disponivel_junino ? 1 : 0
    })

    if (unidades && unidades.length > 0) {
      const produtoUnidades = unidades.map(unidade_id => ({
        produto_id,
        unidade_id,
        disponivel: 1
      }))
      await knex("produtos_unidades").insert(produtoUnidades)
    }

    return { id: produto_id }
  }

  async index({ search, unidade_id }) {
    const query = knex("produtos").orderBy("nome")

    if (search) {
      query.whereLike("nome", `%${search}%`)
        .orWhereLike("categoria", `%${search}%`)
    }

    if (unidade_id) {
      query
        .join("produtos_unidades", "produtos.id", "produtos_unidades.produto_id")
        .where("produtos_unidades.unidade_id", unidade_id)
        .where("produtos_unidades.disponivel", 1)
        .select("produtos.*")
    }

    const produtos = await query
    return produtos
  }

  async show({ id }) {
    const produto = await knex("produtos").where({ id }).first()
    if (!produto) {
      throw new AppError("Produto não encontrado", 404)
    }

    const unidades = await knex("produtos_unidades")
      .join("unidades", "produtos_unidades.unidade_id", "unidades.id")
      .where("produtos_unidades.produto_id", id)
      .select("unidades.id", "unidades.nome", "produtos_unidades.disponivel")

    return { ...produto, unidades }
  }

  async update({ id, nome, descricao, preco, categoria, disponivel_junino }) {
    const produto = await knex("produtos").where({ id }).first()
    if (!produto) {
      throw new AppError("Produto não encontrado", 404)
    }

    if (preco && preco <= 0) {
      throw new AppError("O preço deve ser maior que zero")
    }

    await knex("produtos").where({ id }).update({
      nome: nome ?? produto.nome,
      descricao: descricao ?? produto.descricao,
      preco: preco ?? produto.preco,
      categoria: categoria ?? produto.categoria,
      disponivel_junino: disponivel_junino !== undefined ? (disponivel_junino ? 1 : 0) : produto.disponivel_junino,
      updated_at: knex.fn.now()
    })
  }

  async delete({ id }) {
    const produto = await knex("produtos").where({ id }).first()
    if (!produto) {
      throw new AppError("Produto não encontrado", 404)
    }

    await knex("produtos").where({ id }).delete()
  }
}

module.exports = ProdutosService