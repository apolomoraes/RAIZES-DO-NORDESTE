const { Router } = require("express")
const UnidadesController = require("../controllers/UnidadesController")
const authMiddleware = require("../middlewares/authMiddleware")

const unidadesRoutes = Router()
const unidadesController = new UnidadesController()

unidadesRoutes.post("/", authMiddleware, unidadesController.create)
unidadesRoutes.get("/", unidadesController.index)
unidadesRoutes.get("/:id", unidadesController.show)
unidadesRoutes.put("/:id", authMiddleware, unidadesController.update)

module.exports = unidadesRoutes