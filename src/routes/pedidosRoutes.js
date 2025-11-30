const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const asyncHandler = require("../middlewares/asyncHandler");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/meus/pedidos", authenticate, asyncHandler(pedidosController.getMeusPedidos.bind(pedidosController)));
router.post("/", authenticate, asyncHandler(pedidosController.create.bind(pedidosController)));
router.patch("/:id", authenticate, asyncHandler(pedidosController.update.bind(pedidosController)));
router.delete("/:id", authenticate, asyncHandler(pedidosController.delete.bind(pedidosController)));

// Rotas públicas (sem autenticação) - para consulta
router.get("/", asyncHandler(pedidosController.getAll.bind(pedidosController)));
router.get("/status/:status", asyncHandler(pedidosController.getByStatus.bind(pedidosController)));
router.get("/search/date", asyncHandler(pedidosController.getByDate.bind(pedidosController)));
router.get("/:id", asyncHandler(pedidosController.getById.bind(pedidosController)));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemPedido:
 *       type: object
 *       required:
 *         - produto_id
 *         - quantidade
 *         - valor_unitario
 *       description: Item de um pedido (produto + quantidade + valor)
 *       properties:
 *         produto_id:
 *           type: string
 *           format: uuid
 *           description: UUID do produto
 *           example: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *         quantidade:
 *           type: integer
 *           minimum: 1
 *           description: Quantidade do produto
 *           example: 10
 *         valor_unitario:
 *           type: number
 *           minimum: 0
 *           description: Valor unitário do produto (no momento da compra)
 *           example: 15.50
 *
 *     PedidoCadastro:
 *       type: object
 *       required:
 *         - loja_id
 *         - forma_pagamento
 *         - prazo_dias
 *         - produtos
 *       description: Dados para cadastro de um novo pedido
 *       properties:
 *         loja_id:
 *           type: string
 *           format: uuid
 *           description: UUID da loja que receberá o pedido
 *           example: "7a6cc128-2c5f-6ec0-235a-cd2bfa780145"
 *         descricao:
 *           type: string
 *           minLength: 5
 *           maxLength: 500
 *           description: Descrição/observações do pedido
 *           example: "Pedido urgente - entregar na parte da manhã"
 *         forma_pagamento:
 *           type: string
 *           enum: [dinheiro, cartao_credito, cartao_debito, pix, boleto]
 *           description: Forma de pagamento do pedido
 *           example: "pix"
 *         prazo_dias:
 *           type: integer
 *           minimum: 1
 *           maximum: 365
 *           description: Prazo de entrega em dias
 *           example: 5
 *         status:
 *           type: string
 *           enum: [pendente, enviado, entregue, cancelado]
 *           default: pendente
 *           description: Status inicial do pedido
 *           example: "pendente"
 *         produtos:
 *           type: array
 *           minItems: 1
 *           description: Lista de produtos do pedido
 *           items:
 *             $ref: '#/components/schemas/ItemPedido'
 *
 *     PedidoAtualizar:
 *       type: object
 *       description: Dados para atualização de um pedido (todos os campos são opcionais)
 *       properties:
 *         descricao:
 *           type: string
 *           minLength: 5
 *           maxLength: 500
 *           description: Descrição/observações do pedido
 *           example: "Pedido confirmado - cliente aguardando"
 *         status:
 *           type: string
 *           enum: [pendente, enviado, entregue, cancelado]
 *           description: Status do pedido
 *           example: "enviado"
 *         forma_pagamento:
 *           type: string
 *           enum: [dinheiro, cartao_credito, cartao_debito, pix, boleto]
 *           description: Forma de pagamento
 *           example: "cartao_credito"
 *         prazo_dias:
 *           type: integer
 *           minimum: 1
 *           maximum: 365
 *           description: Prazo de entrega em dias
 *           example: 3
 *
 *     PedidoCompleto:
 *       type: object
 *       description: Representa um pedido completo com seus itens
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do pedido
 *           example: "c1a2f3d4-5b6c-789d-012e-345f6789abcd"
 *         valor_total:
 *           type: number
 *           description: Valor total do pedido (calculado automaticamente)
 *           example: 155.00
 *         descricao:
 *           type: string
 *           description: Descrição/observações do pedido
 *           example: "Pedido urgente"
 *         usuario_id:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário que criou o pedido
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         loja_id:
 *           type: string
 *           format: uuid
 *           description: UUID da loja
 *           example: "7a6cc128-2c5f-6ec0-235a-cd2bfa780145"
 *         status:
 *           type: string
 *           enum: [pendente, enviado, entregue, cancelado]
 *           description: Status do pedido
 *           example: "pendente"
 *         forma_pagamento:
 *           type: string
 *           enum: [dinheiro, cartao_credito, cartao_debito, pix, boleto]
 *           description: Forma de pagamento
 *           example: "pix"
 *         prazo_dias:
 *           type: integer
 *           description: Prazo de entrega em dias
 *           example: 5
 *         criado_em:
 *           type: string
 *           format: date-time
 *           description: Data de criação do pedido
 *           example: "2024-10-18T10:00:00.000Z"
 *         enviado_em:
 *           type: string
 *           format: date-time
 *           description: Data de envio do pedido
 *           example: null
 *         entregue_em:
 *           type: string
 *           format: date-time
 *           description: Data de entrega do pedido
 *           example: null
 *         itens:
 *           type: array
 *           description: Lista de produtos do pedido
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "item-uuid-123"
 *               pedido_id:
 *                 type: string
 *                 format: uuid
 *                 example: "c1a2f3d4-5b6c-789d-012e-345f6789abcd"
 *               produto_id:
 *                 type: string
 *                 format: uuid
 *                 example: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *               produto_nome:
 *                 type: string
 *                 example: "Caneta Azul"
 *               quantidade:
 *                 type: integer
 *                 example: 10
 *               valor_unitario:
 *                 type: number
<<<<<<< HEAD
 *                 example: 15.50
=======
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
>>>>>>> main
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     description: Retorna todos os pedidos não deletados do sistema
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
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
 *                   example: "Pedidos encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PedidoCompleto'
 */

/**
 * @swagger
 * /pedidos/status/{status}:
 *   get:
 *     summary: Busca pedidos por status
 *     description: Retorna todos os pedidos com o status especificado
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pendente, enviado, entregue, cancelado]
 *         description: Status do pedido
 *         example: "pendente"
 *     responses:
 *       200:
 *         description: Pedidos encontrados com sucesso
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
 *                   example: "Pedidos encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PedidoCompleto'
 *       400:
 *         description: Status inválido
 *
 * /pedidos/search/date:
 *   get:
 *     summary: Busca pedidos por data
 *     description: Retorna todos os pedidos criados na data especificada
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *         description: Data no formato YYYY-MM-DD
 *         example: "2024-10-18"
 *     responses:
 *       200:
 *         description: Pedidos encontrados na data especificada
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
 *                   example: "Pedidos encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PedidoCompleto'
 *       400:
 *         description: Data inválida (formato deve ser YYYY-MM-DD)
 *
 * /pedidos/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID (com seus itens)
 *     description: Retorna os dados completos de um pedido incluindo seus produtos
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do pedido
 *         example: "c1a2f3d4-5b6c-789d-012e-345f6789abcd"
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
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
 *                   example: "Pedido encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/PedidoCompleto'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido com seus produtos (transação atômica)
 *     description: Cria um pedido validando loja, produtos e estoque. Atualiza estoque automaticamente. Requer autenticação JWT.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
<<<<<<< HEAD
 *             $ref: '#/components/schemas/PedidoCadastro'
 *           example:
 *             loja_id: "7a6cc128-2c5f-6ec0-235a-cd2bfa780145"
 *             descricao: "Pedido urgente - entregar pela manhã"
 *             forma_pagamento: "pix"
 *             prazo_dias: 5
 *             produtos:
 *               - produto_id: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *                 quantidade: 10
 *                 valor_unitario: 15.50
 *               - produto_id: "1a2b3c4d-5e6f-7890-abcd-ef1234567890"
 *                 quantidade: 5
 *                 valor_unitario: 25.00
=======
 *             $ref: '#/components/schemas/PedidoInput'
>>>>>>> main
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso (com valor total calculado)
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
 *                   example: "Pedido criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/PedidoCompleto'
 *       400:
 *         description: Dados inválidos (validação Joi)
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Loja não pertence ao usuário autenticado
 *       404:
 *         description: Loja ou produto não encontrado
 *       409:
 *         description: Estoque insuficiente para algum produto
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   patch:
 *     summary: Atualiza um pedido existente
 *     description: Atualiza parcialmente os dados de um pedido. Apenas pedidos com status 'pendente' podem ser editados. Requer autenticação JWT e IDOR protection.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do pedido
 *         example: "c1a2f3d4-5b6c-789d-012e-345f6789abcd"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
<<<<<<< HEAD
 *             $ref: '#/components/schemas/PedidoAtualizar'
 *           example:
 *             status: "enviado"
 *             descricao: "Pedido confirmado - saiu para entrega"
=======
 *             $ref: '#/components/schemas/PedidoInput'
>>>>>>> main
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
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
 *                   example: "Pedido atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/PedidoCompleto'
 *       400:
 *         description: Dados inválidos ou ID inválido
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Pedido não pertence ao usuário autenticado
 *       404:
 *         description: Pedido não encontrado
 *       409:
 *         description: Pedido não pode ser editado (status diferente de 'pendente')
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Deleta um pedido (soft delete)
 *     description: Remove logicamente um pedido e seus itens. Apenas pedidos 'pendente' ou 'cancelado' podem ser deletados. Requer autenticação JWT e IDOR protection.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do pedido
 *         example: "c1a2f3d4-5b6c-789d-012e-345f6789abcd"
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
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
 *                   example: "Pedido deletado com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Pedido não pertence ao usuário autenticado
 *       404:
 *         description: Pedido não encontrado
 *       409:
 *         description: Pedido não pode ser deletado (status 'enviado' ou 'entregue')
 */
