const AppError = require("../../utils/AppError")
const knex = require("../../infrastructure/database/knex")

class UnidadesService {
  async create({ nome, endereco, cidade, estado, tipo }) {
    if (!nome || !endereco || !cidade || !estado) {
      throw new AppError("Preencha todos os campos obrigatórios")
    }

    const tiposValidos = ["completa", "reduzida"]
    if (tipo && !tiposValidos.includes(tipo)) {
      throw new AppError("Tipo inválido. Use: completa ou reduzida")
    }

    const unidadeExiste = await knex("unidades").where({ nome }).first()
    if (unidadeExiste) {
      throw new AppError("Já existe uma unidade com esse nome")
    }

    const [id] = await knex("unidades").insert({
      nome,
      endereco,
      cidade,
      estado,
      tipo: tipo ?? "completa"
    })

    return { id }
  }

  async index() {
    const unidades = await knex("unidades").orderBy("nome")
    return unidades
  }

  async show({ id }) {
    const unidade = await knex("unidades").where({ id }).first()
    if (!unidade) {
      throw new AppError("Unidade não encontrada", 404)
    }
    return unidade
  }

  async update({ id, nome, endereco, cidade, estado, tipo }) {
    const unidade = await knex("unidades").where({ id }).first()
    if (!unidade) {
      throw new AppError("Unidade não encontrada", 404)
    }

    const tiposValidos = ["completa", "reduzida"]
    if (tipo && !tiposValidos.includes(tipo)) {
      throw new AppError("Tipo inválido. Use: completa ou reduzida")
    }

    if (nome && nome !== unidade.nome) {
      const nomeEmUso = await knex("unidades").where({ nome }).first()
      if (nomeEmUso) {
        throw new AppError("Já existe uma unidade com esse nome")
      }
    }

    await knex("unidades").where({ id }).update({
      nome: nome ?? unidade.nome,
      endereco: endereco ?? unidade.endereco,
      cidade: cidade ?? unidade.cidade,
      estado: estado ?? unidade.estado,
      tipo: tipo ?? unidade.tipo,
      updated_at: knex.fn.now()
    })
  }
}

module.exports = UnidadesService