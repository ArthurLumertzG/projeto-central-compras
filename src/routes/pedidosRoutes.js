const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", asyncHandler(pedidosController.getAll));
router.get("/:id", asyncHandler(pedidosController.getById));
router.get("/search/date", asyncHandler(pedidosController.getByDate));
router.post("/", asyncHandler(pedidosController.create));
router.patch("/:id", asyncHandler(pedidosController.update));
router.delete("/:id", asyncHandler(pedidosController.delete));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       required:
 *         - store_id
 *         - item
 *         - total_amount
 *         - status
 *         - date
 *       description: Representa um pedido na central de compras.
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do pedido gerado automaticamente
 *           example: "c1a2f3d4-5b6c-789d-012e-345f6789abcd"
 *         store_id:
 *           type: string
 *           format: uuid
 *           description: ID da loja que realizou o pedido
 *           example: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         item:
 *           type: array
 *           description: Lista de itens do pedido
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 format: uuid
 *                 example: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               campaign_id:
 *                 type: string
 *                 format: uuid
 *                 example: "3d2c1b0a-9f8e-7654-3210-fedcba987654"
 *               unit_price:
 *                 type: number
 *                 format: float
 *                 example: 150.00
 *         total_amount:
 *           type: number
 *           format: float
 *           description: Valor total do pedido
 *           example: 300.00
 *         status:
 *           type: string
 *           description: Status do pedido
 *           enum: [Pending, Shipped, Delivered]
 *           example: "Pending"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data do pedido
 *           example: "2023-08-15T16:00:00Z"
 *     PedidoInput:
 *       type: object
 *       required:
 *         - store_id
 *         - item
 *         - total_amount
 *         - status
 *         - date
 *       description: Schema para criação e atualização de pedido (sem ID).
 *       properties:
 *         store_id:
 *           type: string
 *           format: uuid
 *           description: ID da loja que realizou o pedido
 *           example: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         item:
 *           type: array
 *           description: Lista de itens do pedido
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 format: uuid
 *                 example: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               campaign_id:
 *                 type: string
 *                 format: uuid
 *                 example: "3d2c1b0a-9f8e-7654-3210-fedcba987654"
 *               unit_price:
 *                 type: number
 *                 format: float
 *                 example: 150.00
 *         total_amount:
 *           type: number
 *           format: float
 *           description: Valor total do pedido
 *           example: 300.00
 *         status:
 *           type: string
 *           description: Status do pedido
 *           enum: [Pending, Shipped, Delivered]
 *           example: "Pending"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data do pedido
 *           example: "2023-08-15T16:00:00Z"
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos - Davi da Silva Valvassori]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Pedidos - Davi da Silva Valvassori]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/search/date:
 *   get:
 *     summary: Busca pedidos por data
 *     tags: [Pedidos - Davi da Silva Valvassori]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Lista de pedidos encontrados na data especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos - Davi da Silva Valvassori]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   patch:
 *     summary: Atualiza um pedido existente
 *     tags: [Pedidos - Davi da Silva Valvassori]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Pedidos - Davi da Silva Valvassori]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
