const { Router } = require("express")
const FidelidadeController = require("../controllers/FidelidadeController")
const authMiddleware = require("../middlewares/authMiddleware")

const fidelidadeRoutes = Router()
const fidelidadeController = new FidelidadeController()

fidelidadeRoutes.post("/consentimento", authMiddleware, fidelidadeController.registrarConsentimento)
fidelidadeRoutes.get("/saldo", authMiddleware, fidelidadeController.saldo)
fidelidadeRoutes.get("/historico", authMiddleware, fidelidadeController.historico)
fidelidadeRoutes.post("/resgatar", authMiddleware, fidelidadeController.resgatar)

module.exports = fidelidadeRoutes