const { Router } = require("express")
const ProdutosController = require("../controllers/ProdutosController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const produtosRoutes = Router()
const produtosController = new ProdutosController()

produtosRoutes.post("/", authMiddleware, roleMiddleware("admin", "gerente"), produtosController.create)
produtosRoutes.get("/", produtosController.index)
produtosRoutes.get("/:id", produtosController.show)
produtosRoutes.put("/:id", authMiddleware, roleMiddleware("admin", "gerente"), produtosController.update)
produtosRoutes.delete("/:id", authMiddleware, roleMiddleware("admin", "gerente"), produtosController.delete)

module.exports = produtosRoutes