const express = require("express");
const router = express.Router();
const condicaoComercialController = require("../controllers/condicaoComercialController");
const asyncHandler = require("../middlewares/asyncHandler");
const { authenticate } = require("../middlewares/authMiddleware");

// Todas as rotas de condições comerciais requerem autenticação
router.get("/", authenticate, asyncHandler(condicaoComercialController.getAll.bind(condicaoComercialController)));
router.get("/:id", authenticate, asyncHandler(condicaoComercialController.getById.bind(condicaoComercialController)));
router.post("/", authenticate, asyncHandler(condicaoComercialController.create.bind(condicaoComercialController)));
router.patch("/:id", authenticate, asyncHandler(condicaoComercialController.update.bind(condicaoComercialController)));
router.delete("/:id", authenticate, asyncHandler(condicaoComercialController.delete.bind(condicaoComercialController)));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CondicaoComercialCadastro:
 *       type: object
 *       required:
 *         - uf
 *         - cashback_porcentagem
 *         - prazo_extendido_dias
 *         - variacao_unitario
 *       description: Dados para cadastro de uma nova condição comercial
 *       properties:
 *         uf:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *           description: Sigla do estado (UF)
 *           example: "SP"
 *         cashback_porcentagem:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Percentual de cashback (0-100)
 *           example: 2.5
 *         prazo_extendido_dias:
 *           type: integer
 *           minimum: 0
 *           description: Prazo extendido em dias
 *           example: 30
 *         variacao_unitario:
 *           type: number
 *           description: Variação do preço unitário
 *           example: 0.50
 *
 *     CondicaoComercialAtualizar:
 *       type: object
 *       description: Dados para atualização de uma condição comercial (todos os campos são opcionais)
 *       properties:
 *         cashback_porcentagem:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Percentual de cashback (0-100)
 *           example: 3.0
 *         prazo_extendido_dias:
 *           type: integer
 *           minimum: 0
 *           description: Prazo extendido em dias
 *           example: 45
 *         variacao_unitario:
 *           type: number
 *           description: Variação do preço unitário
 *           example: 0.75
 *
 *     CondicaoComercial:
 *       type: object
 *       description: Condição comercial completa retornada pela API
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: UUID da condição comercial
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         uf:
 *           type: string
 *           description: Sigla do estado (UF)
 *           example: "SP"
 *         cashback_porcentagem:
 *           type: number
 *           description: Percentual de cashback
 *           example: 2.5
 *         prazo_extendido_dias:
 *           type: integer
 *           description: Prazo extendido em dias
 *           example: 30
 *         variacao_unitario:
 *           type: number
 *           description: Variação do preço unitário
 *           example: 0.50
 *         fornecedor_id:
 *           type: string
 *           format: uuid
 *           description: UUID do fornecedor
 *           example: "987e6543-e21b-43d1-b654-123456789abc"
 *         criado_em:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *           example: "2024-01-15T10:30:00Z"
 *         atualizado_em:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-20T14:45:00Z"
 *
 * /condicoes-comerciais:
 *   get:
 *     summary: Lista todas as condições comerciais do fornecedor logado
 *     tags: [Condições Comerciais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de condições comerciais retornada com sucesso
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
 *                   example: "Condições comerciais encontradas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CondicaoComercial'
 *       401:
 *         description: Não autenticado
 *
 *   post:
 *     summary: Cria uma nova condição comercial
 *     tags: [Condições Comerciais]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CondicaoComercialCadastro'
 *     responses:
 *       201:
 *         description: Condição comercial criada com sucesso
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
 *                   example: "Condição comercial criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/CondicaoComercial'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       409:
 *         description: Já existe condição para este estado
 *
 * /condicoes-comerciais/{id}:
 *   get:
 *     summary: Busca uma condição comercial por ID
 *     tags: [Condições Comerciais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da condição comercial
 *     responses:
 *       200:
 *         description: Condição comercial encontrada
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
 *                   example: "Condição comercial encontrada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/CondicaoComercial'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Condição comercial não encontrada
 *
 *   patch:
 *     summary: Atualiza uma condição comercial
 *     tags: [Condições Comerciais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da condição comercial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CondicaoComercialAtualizar'
 *     responses:
 *       200:
 *         description: Condição comercial atualizada com sucesso
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
 *                   example: "Condição comercial atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/CondicaoComercial'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Condição comercial não encontrada
 *
 *   delete:
 *     summary: Remove uma condição comercial (soft delete)
 *     tags: [Condições Comerciais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da condição comercial
 *     responses:
 *       200:
 *         description: Condição comercial deletada com sucesso
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
 *                   example: "Condição comercial deletada com sucesso"
 *                 data:
 *                   type: null
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Condição comercial não encontrada
 */
