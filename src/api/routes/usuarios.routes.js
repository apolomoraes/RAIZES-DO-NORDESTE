const { Router } = require("express")
const UsuariosController = require("../controllers/UsuariosController")
const authMiddleware = require("../middlewares/authMiddleware")

const usuariosRoutes = Router()
const usuariosController = new UsuariosController()

usuariosRoutes.post("/", usuariosController.create)
usuariosRoutes.get("/:id", authMiddleware, usuariosController.show)
usuariosRoutes.put("/:id", authMiddleware, usuariosController.update)

module.exports = usuariosRoutes