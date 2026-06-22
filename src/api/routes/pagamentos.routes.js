const { Router } = require("express")
const PagamentoController = require("../controllers/PagamentoController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const pagamentoRoutes = Router()
const pagamentoController = new PagamentoController()

pagamentoRoutes.post("/solicitar", authMiddleware, roleMiddleware("cliente", "atendente", "admin"), pagamentoController.solicitar)
pagamentoRoutes.get("/:pedido_id", authMiddleware, roleMiddleware("admin", "gerente", "atendente"), pagamentoController.show)

module.exports = pagamentoRoutes