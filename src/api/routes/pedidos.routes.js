const { Router } = require("express")
const PedidosController = require("../controllers/PedidosController")

const pedidosRoutes = Router()
const pedidosController = new PedidosController()

pedidosRoutes.post("/", pedidosController.create)
pedidosRoutes.get("/", pedidosController.index)
pedidosRoutes.get("/:id", pedidosController.show)
pedidosRoutes.patch("/:id/status", pedidosController.updateStatus)
pedidosRoutes.patch("/:id/cancelar", pedidosController.cancel)

module.exports = pedidosRoutes