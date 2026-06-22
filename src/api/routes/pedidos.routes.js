const { Router } = require("express")
const PedidosController = require("../controllers/PedidosController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const pedidosRoutes = Router()
const pedidosController = new PedidosController()

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Criar novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [unidade_id, canal_pedido, itens]
 *             properties:
 *               unidade_id:
 *                 type: integer
 *                 example: 1
 *               canal_pedido:
 *                 type: string
 *                 enum: [APP, TOTEM, BALCAO, PICKUP, WEB]
 *                 example: APP
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produto_id:
 *                       type: integer
 *                       example: 1
 *                     quantidade:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       404:
 *         description: Produto ou unidade não encontrado
 *       409:
 *         description: Estoque insuficiente
 *       422:
 *         description: Canal inválido
 */
pedidosRoutes.post("/", authMiddleware, roleMiddleware("cliente", "atendente", "admin"), pedidosController.create)

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: canal_pedido
 *         schema:
 *           type: string
 *           enum: [APP, TOTEM, BALCAO, PICKUP, WEB]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AGUARDANDO_PAGAMENTO, EM_PREPARO, PRONTO, ENTREGUE, CANCELADO]
 *       - in: query
 *         name: unidade_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       403:
 *         description: Acesso negado
 */
pedidosRoutes.get("/", authMiddleware, roleMiddleware("admin", "gerente"), pedidosController.index)

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do pedido com itens
 *       404:
 *         description: Pedido não encontrado
 */
pedidosRoutes.get("/:id", authMiddleware, pedidosController.show)

/**
 * @swagger
 * /pedidos/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [EM_PREPARO, PRONTO, ENTREGUE, CANCELADO]
 *                 example: EM_PREPARO
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 *       409:
 *         description: Status não pode ser alterado
 */
pedidosRoutes.patch("/:id/status", authMiddleware, roleMiddleware("cozinha", "gerente", "admin"), pedidosController.updateStatus)

/**
 * @swagger
 * /pedidos/{id}/cancelar:
 *   patch:
 *     summary: Cancelar pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       409:
 *         description: Pedido não pode ser cancelado
 */
pedidosRoutes.patch("/:id/cancelar", authMiddleware, pedidosController.cancel)

module.exports = pedidosRoutes