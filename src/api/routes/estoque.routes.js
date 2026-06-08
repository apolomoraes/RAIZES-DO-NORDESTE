const { Router } = require("express")
const EstoqueController = require("../controllers/EstoqueController")

const estoqueRoutes = Router()
const estoqueController = new EstoqueController()

estoqueRoutes.post("/entrada", estoqueController.entrada)
estoqueRoutes.post("/saida", estoqueController.saida)
estoqueRoutes.get("/:unidadeId", estoqueController.show)

module.exports = estoqueRoutes