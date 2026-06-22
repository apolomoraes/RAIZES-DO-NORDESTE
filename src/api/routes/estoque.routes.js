const { Router } = require("express")
const EstoqueController = require("../controllers/EstoqueController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const estoqueRoutes = Router()
const estoqueController = new EstoqueController()

estoqueRoutes.post("/entrada", authMiddleware, roleMiddleware("admin", "gerente"), estoqueController.entrada)
estoqueRoutes.post("/saida", authMiddleware, roleMiddleware("admin", "gerente"), estoqueController.saida)
estoqueRoutes.get("/:unidade_id", authMiddleware, roleMiddleware("admin", "gerente", "atendente"), estoqueController.show)

module.exports = estoqueRoutes