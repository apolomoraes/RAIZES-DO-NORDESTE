const { Router } = require("express")
const FidelidadeController = require("../controllers/FidelidadeController")
const authMiddleware = require("../middlewares/authMiddleware")

const fidelidadeRoutes = Router()
const fidelidadeController = new FidelidadeController()

/**
 * @swagger
 * /fidelidade/consentimento:
 *   post:
 *     summary: Registrar consentimento LGPD do cliente
 *     tags: [Fidelidade]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [finalidade, aceito]
 *             properties:
 *               finalidade:
 *                 type: string
 *                 example: programa_fidelidade
 *               aceito:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Consentimento registrado com sucesso
 */
fidelidadeRoutes.post("/consentimento", authMiddleware, fidelidadeController.registrarConsentimento)

/**
 * @swagger
 * /fidelidade/saldo:
 *   get:
 *     summary: Consultar saldo de pontos do cliente
 *     tags: [Fidelidade]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo de pontos
 *       403:
 *         description: Cliente sem consentimento
 */
fidelidadeRoutes.get("/saldo", authMiddleware, fidelidadeController.saldo)

/**
 * @swagger
 * /fidelidade/historico:
 *   get:
 *     summary: Consultar histórico de pontos do cliente
 *     tags: [Fidelidade]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico de pontos
 *       403:
 *         description: Cliente sem consentimento
 */
fidelidadeRoutes.get("/historico", authMiddleware, fidelidadeController.historico)

/**
 * @swagger
 * /fidelidade/resgatar:
 *   post:
 *     summary: Resgatar pontos de fidelidade
 *     tags: [Fidelidade]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pontos]
 *             properties:
 *               pontos:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Pontos resgatados com sucesso
 *       400:
 *         description: Quantidade inválida ou abaixo do mínimo
 *       403:
 *         description: Cliente sem consentimento
 *       409:
 *         description: Saldo insuficiente
 */
fidelidadeRoutes.post("/resgatar", authMiddleware, fidelidadeController.resgatar)

module.exports = fidelidadeRoutes