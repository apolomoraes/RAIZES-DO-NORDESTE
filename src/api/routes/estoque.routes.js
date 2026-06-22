const { Router } = require("express")
const EstoqueController = require("../controllers/EstoqueController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const estoqueRoutes = Router()
const estoqueController = new EstoqueController()

/**
 * @swagger
 * /estoque/entrada:
 *   post:
 *     summary: Registrar entrada de estoque
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [produto_id, unidade_id, quantidade]
 *             properties:
 *               produto_id:
 *                 type: integer
 *                 example: 1
 *               unidade_id:
 *                 type: integer
 *                 example: 1
 *               quantidade:
 *                 type: integer
 *                 example: 50
 *               motivo:
 *                 type: string
 *                 example: Reposição semanal
 *     responses:
 *       200:
 *         description: Entrada registrada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto ou unidade não encontrado
 */
estoqueRoutes.post("/entrada", authMiddleware, roleMiddleware("admin", "gerente"), estoqueController.entrada)

/**
 * @swagger
 * /estoque/saida:
 *   post:
 *     summary: Registrar saída de estoque
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [produto_id, unidade_id, quantidade]
 *             properties:
 *               produto_id:
 *                 type: integer
 *                 example: 1
 *               unidade_id:
 *                 type: integer
 *                 example: 1
 *               quantidade:
 *                 type: integer
 *                 example: 5
 *               motivo:
 *                 type: string
 *                 example: Venda balcão
 *     responses:
 *       200:
 *         description: Saída registrada com sucesso
 *       403:
 *         description: Acesso negado
 *       409:
 *         description: Estoque insuficiente
 */
estoqueRoutes.post("/saida", authMiddleware, roleMiddleware("admin", "gerente"), estoqueController.saida

/**
 * @swagger
 * /estoque/{unidade_id}:
 *   get:
 *     summary: Consultar estoque por unidade
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unidade_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estoque da unidade
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Unidade não encontrada
 */)
estoqueRoutes.get("/:unidade_id", authMiddleware, roleMiddleware("admin", "gerente", "atendente"), estoqueController.show)

module.exports = estoqueRoutes