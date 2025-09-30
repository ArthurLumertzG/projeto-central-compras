const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", asyncHandler(produtosController.getAll));
router.get("/id/:id", asyncHandler(produtosController.getById));
router.get("/name/:nome", asyncHandler(produtosController.getByName));
router.post("/", asyncHandler(produtosController.create));
router.patch("/:id", asyncHandler(produtosController.update));
router.delete("/:id", asyncHandler(produtosController.delete));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - preco
 *         - estoque
 *         - fornecedor_id
 *         - status
 *       description: Representa um produto no sistema.
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do produto gerado automaticamente
 *           example: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
 *         nome:
 *           type: string
 *           description: Nome do produto
 *           example: "Notebook Gamer"
 *         descricao:
 *           type: string
 *           description: Descrição detalhada do produto
 *           example: "Notebook com processador i7, 16GB RAM, 512GB SSD"
 *         preco:
 *           type: number
 *           format: float
 *           description: Preço do produto
 *           example: 4599.90
 *         estoque:
 *           type: integer
 *           description: Quantidade em estoque
 *           example: 25
 *         fornecedor_id:
 *           type: string
 *           format: uuid
 *           description: ID do fornecedor associado ao produto
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *         status:
 *           type: string
 *           description: Status do produto
 *           example: "ativo"
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Produtos retornados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 */

/**
 * @swagger
 * /produtos/id/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Produto encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */

/**
 * @swagger
 * /produtos/name/{name}:
 *   get:
 *     summary: Busca um produto pelo nome
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do produto
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Produto encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Produto criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /produtos/{id}:
 *   patch:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Produto atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Produto removido com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Produto não encontrado
 */
