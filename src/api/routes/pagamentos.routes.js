const { Router } = require("express")
const PagamentoController = require("../controllers/PagamentoController")

const pagamentoRoutes = Router()
const pagamentoController = new PagamentoController()

pagamentoRoutes.post("/solicitar", pagamentoController.solicitar)
pagamentoRoutes.post("/confirmar", pagamentoController.confirmar)

module.exports = pagamentoRoutes