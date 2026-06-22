const { Router } = require("express")
const UnidadesController = require("../controllers/UnidadesController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const unidadesRoutes = Router()
const unidadesController = new UnidadesController()

/**
 * @swagger
 * /unidades:
 *   post:
 *     summary: Criar nova unidade
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, endereco, cidade, estado]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Unidade Recife Centro
 *               endereco:
 *                 type: string
 *                 example: Rua da Aurora, 100
 *               cidade:
 *                 type: string
 *                 example: Recife
 *               estado:
 *                 type: string
 *                 example: PE
 *               tipo:
 *                 type: string
 *                 enum: [completa, reduzida]
 *                 example: completa
 *     responses:
 *       201:
 *         description: Unidade criada com sucesso
 *       400:
 *         description: Erro de validação
 *       403:
 *         description: Acesso negado
 */
unidadesRoutes.post("/", authMiddleware, roleMiddleware("admin", "gerente"), unidadesController.create)

/**
 * @swagger
 * /unidades:
 *   get:
 *     summary: Listar todas as unidades
 *     tags: [Unidades]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de unidades
 */
unidadesRoutes.get("/", unidadesController.index)

/**
 * @swagger
 * /unidades/{id}:
 *   get:
 *     summary: Buscar unidade por ID
 *     tags: [Unidades]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da unidade
 *       404:
 *         description: Unidade não encontrada
 */
unidadesRoutes.get("/:id", unidadesController.show)

/**
 * @swagger
 * /unidades/{id}:
 *   put:
 *     summary: Atualizar unidade
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [completa, reduzida]
 *     responses:
 *       200:
 *         description: Unidade atualizada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Unidade não encontrada
 */
unidadesRoutes.put("/:id", authMiddleware, roleMiddleware("admin", "gerente"), unidadesController.update)

module.exports = unidadesRoutes