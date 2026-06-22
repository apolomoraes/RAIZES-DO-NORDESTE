const { Router } = require("express")
const PagamentoController = require("../controllers/PagamentoController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const pagamentoRoutes = Router()
const pagamentoController = new PagamentoController()

/**
 * @swagger
 * /pagamento/solicitar:
 *   post:
 *     summary: Solicitar pagamento via gateway mock
 *     tags: [Pagamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pedido_id, forma_pagamento]
 *             properties:
 *               pedido_id:
 *                 type: integer
 *                 example: 1
 *               forma_pagamento:
 *                 type: string
 *                 enum: [PIX, CARTAO_CREDITO, CARTAO_DEBITO, DINHEIRO]
 *                 example: PIX
 *     responses:
 *       200:
 *         description: Resultado do pagamento mock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagamento_id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [APROVADO, RECUSADO]
 *                 mensagem:
 *                   type: string
 *                 transacao_id:
 *                   type: string
 *                 pedido_status:
 *                   type: string
 *       404:
 *         description: Pedido não encontrado
 *       409:
 *         description: Pedido já possui pagamento aprovado
 *       422:
 *         description: Forma de pagamento inválida
 */
pagamentoRoutes.post("/solicitar", authMiddleware, roleMiddleware("cliente", "atendente", "admin"), pagamentoController.solicitar)

/**
 * @swagger
 * /pagamento/{pedido_id}:
 *   get:
 *     summary: Consultar pagamento do pedido
 *     tags: [Pagamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pedido_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do pagamento com payload do mock
 *       404:
 *         description: Pagamento não encontrado
 */
pagamentoRoutes.get("/:pedido_id", authMiddleware, roleMiddleware("admin", "gerente", "atendente"), pagamentoController.show)

module.exports = pagamentoRoutes