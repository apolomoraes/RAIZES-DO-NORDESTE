const { Router } = require("express")
const routes = Router()

const authRoutes = require("./auth.routes")
const usuariosRoutes = require("./usuarios.routes")
const unidadesRoutes = require("./unidades.routes")
const produtosRoutes = require("./produtos.routes")
const estoqueRoutes = require("./estoque.routes")
const pedidosRoutes = require("./pedidos.routes")
const pagamentoRoutes = require("./pagamento.routes")
const fidelidadeRoutes = require("./fidelidade.routes")


routes.use("/auth", authRoutes)
routes.use("/usuarios", usuariosRoutes)
routes.use("/unidades", unidadesRoutes)
routes.use("/produtos", produtosRoutes)
routes.use("/estoque", estoqueRoutes)
routes.use("/pedidos", pedidosRoutes)
routes.use("/pagamento", pagamentoRoutes)
routes.use("/fidelidade", fidelidadeRoutes)

module.exports = routes