const { Router } = require("express")
const ProdutosController = require("../controllers/ProdutosController")

const produtosRoutes = Router()
const produtosController = new ProdutosController()

produtosRoutes.post("/", produtosController.create)
produtosRoutes.get("/", produtosController.index)
produtosRoutes.get("/:id", produtosController.show)
produtosRoutes.put("/:id", produtosController.update)
produtosRoutes.delete("/:id", produtosController.delete)

module.exports = produtosRoutes