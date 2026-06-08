const { Router } = require("express")
const UsuariosController = require("../controllers/UsuariosController")

const usuariosRoutes = Router()
const usuariosController = new UsuariosController()

usuariosRoutes.post("/", usuariosController.create)
usuariosRoutes.get("/:id", usuariosController.show)
usuariosRoutes.put("/:id", usuariosController.update)

module.exports = usuariosRoutes