const express = require("express");
const router = express.Router();
const campanhasController = require("../controllers/campanhaController");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", asyncHandler(campanhasController.getAll));
router.get("/:id", asyncHandler(campanhasController.getById));
router.post("/", asyncHandler(campanhasController.create));
router.patch("/:id", asyncHandler(campanhasController.update));
router.delete("/:id", asyncHandler(campanhasController.delete));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Campanha:
 *       type: object
 *       required:
 *         - nome
 *         - supplier_id
 *         - start_date
 *         - end_date
 *         - discount_percentage
 *       description: Representa uma campanha na central de compras.
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da campanha gerado automaticamente
 *           example: "3f5b4db1-2f13-4d97-bf39-6b1f234abc99"
 *         nome:
 *           type: string
 *           description: Nome da campanha
 *           example: "Black Friday"
 *         supplier_id:
 *           type: string
 *           format: uuid
 *           description: ID do fornecedor vinculado
 *           example: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Data de início da campanha
 *           example: "2023-11-01 00:00:00"
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Data de término da campanha
 *           example: "2023-11-30 23:59:59"
 *         discount_percentage:
 *           type: number
 *           description: Percentual de desconto
 *           example: 20
 *     CampanhaInput:
 *       type: object
 *       required:
 *         - nome
 *         - supplier_id
 *         - start_date
 *         - end_date
 *         - discount_percentage
 *       description: Schema para criação e atualização de campanha (sem ID).
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome da campanha
 *           example: "Black Friday"
 *         supplier_id:
 *           type: string
 *           format: uuid
 *           description: ID do fornecedor vinculado
 *           example: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Data de início da campanha
 *           example: "2023-11-01 00:00:00"
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Data de término da campanha
 *           example: "2023-11-30 23:59:59"
 *         discount_percentage:
 *           type: number
 *           description: Percentual de desconto
 *           example: 20
 */

/**
 * @swagger
 * /campanhas:
 *   get:
 *     summary: Lista todas as campanhas
 *     tags: [Campanhas - Gabriel Pereira José]
 *     responses:
 *       200:
 *         description: Lista de campanhas retornada com sucesso
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
 *                   example: "Campanhas retornadas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Campanha'
 */

/**
 * @swagger
 * /campanhas/{id}:
 *   get:
 *     summary: Busca uma campanha pelo ID
 *     tags: [Campanhas - Gabriel Pereira José]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da campanha
 *     responses:
 *       200:
 *         description: Campanha encontrada com sucesso
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
 *                   example: "Campanha encontrada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Campanha'
 *       404:
 *         description: Campanha não encontrada
 */

/**
 * @swagger
 * /campanhas:
 *   post:
 *     summary: Cria uma nova campanha
 *     tags: [Campanhas - Gabriel Pereira José]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampanhaInput'
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso
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
 *                   example: "Campanha criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Campanha'
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /campanhas/{id}:
 *   patch:
 *     summary: Atualiza uma campanha existente
 *     tags: [Campanhas - Gabriel Pereira José]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da campanha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampanhaInput'
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso
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
 *                   example: "Campanha atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Campanha'
 *       404:
 *         description: Campanha não encontrada
 */

/**
 * @swagger
 * /campanhas/{id}:
 *   delete:
 *     summary: Remove uma campanha
 *     tags: [Campanhas - Gabriel Pereira José]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da campanha
 *     responses:
 *       200:
 *         description: Campanha removida com sucesso
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
 *                   example: "Campanha removida com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Campanha não encontrada
 */
