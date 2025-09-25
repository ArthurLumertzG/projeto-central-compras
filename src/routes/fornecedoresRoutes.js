const express = require("express");
const router = express.Router();
const fornecedoresController = require("../controllers/fornecedoresController");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", asyncHandler(fornecedoresController.getAll));
router.get("/:id", asyncHandler(fornecedoresController.getById));
router.get("/email/:email", asyncHandler(fornecedoresController.getByEmail));
router.post("/", asyncHandler(fornecedoresController.create));
router.patch("/:id", asyncHandler(fornecedoresController.update));
router.delete("/:id", asyncHandler(fornecedoresController.delete));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Fornecedor:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - telefone
 *       description: Representa um fornecedor na central de compras.
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do fornecedor gerado automaticamente
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *         nome:
 *           type: string
 *           description: Nome do fornecedor
 *           example: "Carlos Webber"
 *         categoria:
 *           type: string
 *           description: Categoria do fornecedor
 *           example: "Computadores"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do fornecedor
 *           example: "teste@teste.com"
 *         telefone:
 *           type: string
 *           description: Telefone do fornecedor
 *           example: "51999999"
 *         status:
 *           type: string
 *           description: Status do fornecedor
 *           example: "on"
 */

/**
 * @swagger
 * /fornecedores:
 *   get:
 *     summary: Lista todos os fornecedores
 *     tags: [Fornecedores]
 *     responses:
 *       200:
 *         description: Lista de fornecedores retornada com sucesso
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
 *                   example: "Fornecedores retornados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Fornecedor'
 */

/**
 * @swagger
 * /fornecedores/{id}:
 *   get:
 *     summary: Busca um fornecedor pelo ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor encontrado com sucesso
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
 *                   example: "Fornecedor encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Fornecedor'
 *       404:
 *         description: Fornecedor não encontrado
 */

/**
 * @swagger
 * /fornecedores/email/{email}:
 *   get:
 *     summary: Busca um fornecedor pelo email
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor encontrado com sucesso
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
 *                   example: "Fornecedor encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Fornecedor'
 *       404:
 *         description: Fornecedor não encontrado
 */

/**
 * @swagger
 * /fornecedores:
 *   post:
 *     summary: Cria um novo fornecedor
 *     tags: [Fornecedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fornecedor'
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
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
 *                   example: "Fornecedor criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Fornecedor'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Já existe um fornecedor com este email
 */

/**
 * @swagger
 * /fornecedores/{id}:
 *   patch:
 *     summary: Atualiza um fornecedor existente
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fornecedor'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
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
 *                   example: "Fornecedor atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Fornecedor'
 *       404:
 *         description: Fornecedor não encontrado
 */

/**
 * @swagger
 * /fornecedores/{id}:
 *   delete:
 *     summary: Remove um fornecedor
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor removido com sucesso
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
 *                   example: "Fornecedor removido com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Fornecedor não encontrado
 */
