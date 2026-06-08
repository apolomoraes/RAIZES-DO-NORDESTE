const { Router } = require("express")
const UnidadesController = require("../controllers/UnidadesController")

const unidadesRoutes = Router()
const unidadesController = new UnidadesController()

unidadesRoutes.post("/", unidadesController.create)
unidadesRoutes.get("/", unidadesController.index)
unidadesRoutes.get("/:id", unidadesController.show)
unidadesRoutes.put("/:id", unidadesController.update)

module.exports = unidadesRoutes