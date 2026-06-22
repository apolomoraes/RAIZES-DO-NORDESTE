const { Router } = require("express")
const ProdutosController = require("../controllers/ProdutosController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const produtosRoutes = Router()
const produtosController = new ProdutosController()

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, preco, categoria]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Tapioca Nordestina
 *               descricao:
 *                 type: string
 *                 example: Tapioca recheada com queijo coalho
 *               preco:
 *                 type: number
 *                 example: 12.50
 *               categoria:
 *                 type: string
 *                 example: tapioca
 *               disponivel_junino:
 *                 type: boolean
 *                 example: false
 *               unidades:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erro de validação
 *       403:
 *         description: Acesso negado
 */
produtosRoutes.post("/", authMiddleware, roleMiddleware("admin", "gerente"), produtosController.create)

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Listar produtos
 *     tags: [Produtos]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por nome ou categoria
 *       - in: query
 *         name: unidade_id
 *         schema:
 *           type: integer
 *         description: Filtrar por unidade (cardápio da unidade)
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
produtosRoutes.get("/", produtosController.index)

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do produto com unidades vinculadas
 *       404:
 *         description: Produto não encontrado
 */
produtosRoutes.get("/:id", produtosController.show)

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Produtos]
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
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               categoria:
 *                 type: string
 *               disponivel_junino:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto não encontrado
 */
produtosRoutes.put("/:id", authMiddleware, roleMiddleware("admin", "gerente"), produtosController.update)

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Deletar produto
 *     tags: [Produtos]
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
 *         description: Produto deletado com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto não encontrado
 */
produtosRoutes.delete("/:id", authMiddleware, roleMiddleware("admin", "gerente"), produtosController.delete)

module.exports = produtosRoutes