const ProdutosService = require("../../application/services/ProdutosService")

class ProdutosController {
  async create(req, res) {
    const { nome, descricao, preco, categoria, disponivel_junino, unidades } = req.body
    const service = new ProdutosService()
    const { id } = await service.create({ nome, descricao, preco, categoria, disponivel_junino, unidades })
    return res.status(201).json({ message: "Produto criado com sucesso", id })
  }

  async index(req, res) {
    const { search, unidade_id } = req.query
    const service = new ProdutosService()
    const produtos = await service.index({ search, unidade_id })
    return res.status(200).json(produtos)
  }

  async show(req, res) {
    const { id } = req.params
    const service = new ProdutosService()
    const produto = await service.show({ id: Number(id) })
    return res.status(200).json(produto)
  }

  async update(req, res) {
    const { id } = req.params
    const { nome, descricao, preco, categoria, disponivel_junino } = req.body
    const service = new ProdutosService()
    await service.update({ id: Number(id), nome, descricao, preco, categoria, disponivel_junino })
    return res.status(200).json({ message: "Produto atualizado com sucesso" })
  }

  async delete(req, res) {
    const { id } = req.params
    const service = new ProdutosService()
    await service.delete({ id: Number(id) })
    return res.status(200).json({ message: "Produto deletado com sucesso" })
  }
}

module.exports = ProdutosController