const { Router } = require("express")
const FidelidadeController = require("../controllers/FidelidadeController")

const fidelidadeRoutes = Router()
const fidelidadeController = new FidelidadeController()

fidelidadeRoutes.get("/saldo", fidelidadeController.saldo)
fidelidadeRoutes.get("/historico", fidelidadeController.historico)
fidelidadeRoutes.post("/resgatar", fidelidadeController.resgatar)

module.exports = fidelidadeRoutes