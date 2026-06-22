const { Router } = require("express")
const AuthController = require("../controllers/AuthController")

const authRoutes = Router()
const authController = new AuthController()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticação do usuário
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@raizes.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Campos obrigatórios não informados
 *       401:
 *         description: Email e/ou senha incorreta
 */
authRoutes.post("/login", authController.create)

module.exports = authRoutes