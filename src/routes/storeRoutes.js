const express = require("express");
const router = express.Router();
const storesController = require("../controllers/storesController");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", asyncHandler(storesController.getAll));
router.get("/:id", asyncHandler(storesController.getById));
router.post("/", asyncHandler(storesController.create));
router.patch("/:id", asyncHandler(storesController.update));
router.delete("/:id", asyncHandler(storesController.delete));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - telefone
 *       description: Representa uma loja na central de compras.
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da loja gerado automaticamente
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *         nome:
 *           type: string
 *           description: Nome da loja
 *           example: "Loja Central"
 *         categoria:
 *           type: string
 *           description: Categoria da loja
 *           example: "Eletrônicos"
 *         email:
 *           type: string
 *           format: email
 *           description: Email da loja
 *           example: "loja@teste.com"
 *         telefone:
 *           type: string
 *           description: Telefone da loja
 *           example: "51999999"
 *         status:
 *           type: string
 *           description: Status da loja
 *           example: "on"
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Lista todas as lojas
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: Lista de lojas retornada com sucesso
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
 *                   example: "Lojas retornadas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Store'
 */

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Busca uma loja pelo ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Loja encontrada com sucesso
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
 *                   example: "Loja encontrada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Cria uma nova loja
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       201:
 *         description: Loja criada com sucesso
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
 *                   example: "Loja criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Store'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Já existe uma loja com este email
 */

/**
 * @swagger
 * /stores/{id}:
 *   patch:
 *     summary: Atualiza uma loja existente
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da loja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso
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
 *                   example: "Loja atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Remove uma loja
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Loja removida com sucesso
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
 *                   example: "Loja removida com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Loja não encontrada
 */

