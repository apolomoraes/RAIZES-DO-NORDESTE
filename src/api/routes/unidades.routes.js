const { Router } = require("express")
const UnidadesController = require("../controllers/UnidadesController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const unidadesRoutes = Router()
const unidadesController = new UnidadesController()

unidadesRoutes.post("/", authMiddleware, roleMiddleware("admin", "gerente"), unidadesController.create)
unidadesRoutes.get("/", unidadesController.index)
unidadesRoutes.get("/:id", unidadesController.show)
unidadesRoutes.put("/:id", authMiddleware, roleMiddleware("admin", "gerente"), unidadesController.update)

module.exports = unidadesRoutes