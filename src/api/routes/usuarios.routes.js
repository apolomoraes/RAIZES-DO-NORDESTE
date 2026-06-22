const { Router } = require("express")
const UsuariosController = require("../controllers/UsuariosController")
const authMiddleware = require("../middlewares/authMiddleware")

const usuariosRoutes = Router()
const usuariosController = new UsuariosController()

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastro de novo usuário
 *     tags: [Usuários]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, password]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 example: cliente
 *                 enum: [cliente, atendente, cozinha, gerente, admin]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 */
usuariosRoutes.post("/", usuariosController.create)

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Usuários]
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
 *         description: Dados do usuário
 *       404:
 *         description: Usuário não encontrado
 */
usuariosRoutes.get("/:id", authMiddleware, usuariosController.show)

/**
 * @swagger
 * /usuarios:
 *   put:
 *     summary: Atualizar dados do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               old_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Erro de validação
 */
usuariosRoutes.put("/", authMiddleware, usuariosController.update)

module.exports = usuariosRoutes