const { Router } = require("express")
const PedidosController = require("../controllers/PedidosController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const pedidosRoutes = Router()
const pedidosController = new PedidosController()

pedidosRoutes.post("/", authMiddleware, roleMiddleware("cliente", "atendente", "admin"), pedidosController.create)
pedidosRoutes.get("/", authMiddleware, roleMiddleware("admin", "gerente"), pedidosController.index)
pedidosRoutes.get("/:id", authMiddleware, pedidosController.show)
pedidosRoutes.patch("/:id/status", authMiddleware, roleMiddleware("cozinha", "gerente", "admin"), pedidosController.updateStatus)
pedidosRoutes.patch("/:id/cancelar", authMiddleware, pedidosController.cancel)

module.exports = pedidosRoutes