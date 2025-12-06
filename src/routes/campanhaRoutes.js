const express = require("express");
const router = express.Router();
const campanhasController = require("../controllers/campanhaController");
const asyncHandler = require("../middlewares/asyncHandler");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/", authenticate, asyncHandler(campanhasController.getAll.bind(campanhasController)));
router.get("/status/:status", asyncHandler(campanhasController.getByStatus.bind(campanhasController)));
router.get("/:id", authenticate, asyncHandler(campanhasController.getById.bind(campanhasController)));
router.post("/", authenticate, asyncHandler(campanhasController.create.bind(campanhasController)));
router.patch("/:id", authenticate, asyncHandler(campanhasController.update.bind(campanhasController)));
router.delete("/:id", authenticate, asyncHandler(campanhasController.delete.bind(campanhasController)));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CampanhaCadastro:
 *       type: object
 *       required:
 *         - nome
 *         - desconto_porcentagem
 *       description: Dados para cadastro de uma nova campanha promocional
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Nome da campanha
 *           example: "Black Friday 2024"
 *         descricao:
 *           type: string
 *           minLength: 10
 *           maxLength: 500
 *           description: Descrição detalhada da campanha
 *           example: "Campanha promocional com até 50% de desconto em produtos selecionados"
 *         valor_min:
 *           type: number
 *           minimum: 0
 *           description: Valor mínimo da compra para aplicar o desconto
 *           example: 100.00
 *         quantidade_min:
 *           type: integer
 *           minimum: 1
 *           description: Quantidade mínima de itens para aplicar o desconto
 *           example: 5
 *         desconto_porcentagem:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Percentual de desconto (0-100)
 *           example: 20
 *         status:
 *           type: string
 *           enum: [ativa, inativa, expirada]
 *           default: ativa
 *           description: Status da campanha
 *           example: "ativa"
 *
 *     CampanhaAtualizar:
 *       type: object
 *       description: Dados para atualização de uma campanha (todos os campos são opcionais)
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Nome da campanha
 *           example: "Black Friday 2024 - Estendida"
 *         descricao:
 *           type: string
 *           minLength: 10
 *           maxLength: 500
 *           description: Descrição detalhada da campanha
 *           example: "Campanha estendida até o final do mês"
 *         valor_min:
 *           type: number
 *           minimum: 0
 *           description: Valor mínimo da compra
 *           example: 150.00
 *         quantidade_min:
 *           type: integer
 *           minimum: 1
 *           description: Quantidade mínima de itens
 *           example: 10
 *         desconto_porcentagem:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Percentual de desconto
 *           example: 30
 *         status:
 *           type: string
 *           enum: [ativa, inativa, expirada]
 *           description: Status da campanha
 *           example: "inativa"
 *
 *     CampanhaCompleta:
 *       type: object
 *       description: Representa uma campanha promocional completa
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da campanha
 *           example: "3f5b4db1-2f13-4d97-bf39-6b1f234abc99"
 *         nome:
 *           type: string
 *           description: Nome da campanha
 *           example: "Black Friday 2024"
 *         descricao:
 *           type: string
 *           description: Descrição da campanha
 *           example: "Campanha promocional com até 50% de desconto"
 *         valor_min:
 *           type: number
 *           description: Valor mínimo para aplicar desconto
 *           example: 100.00
 *         quantidade_min:
 *           type: integer
 *           description: Quantidade mínima para aplicar desconto
 *           example: 5
 *         desconto_porcentagem:
 *           type: number
 *           description: Percentual de desconto
 *           example: 20
 *         status:
 *           type: string
 *           enum: [ativa, inativa, expirada]
 *           description: Status da campanha
 *           example: "ativa"
 *         criado_em:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *           example: "2024-10-01T10:00:00.000Z"
 *         atualizado_em:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-10-15T14:30:00.000Z"
 */

/**
 * @swagger
 * /campanhas:
 *   get:
 *     summary: Lista todas as campanhas promocionais
 *     description: Retorna todas as campanhas não deletadas do sistema
 *     tags: [Campanhas]
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
 *                   example: "Campanhas encontradas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CampanhaCompleta'
 */

/**
 * @swagger
 * /campanhas/status/{status}:
 *   get:
 *     summary: Busca campanhas por status
 *     description: Retorna todas as campanhas com o status especificado
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ativa, inativa, expirada]
 *         description: Status da campanha
 *         example: "ativa"
 *     responses:
 *       200:
 *         description: Campanhas encontradas com sucesso
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
 *                   example: "Campanhas encontradas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CampanhaCompleta'
 *       400:
 *         description: Status inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Status deve ser: ativa, inativa ou expirada"
 *
 * /campanhas/{id}:
 *   get:
 *     summary: Busca uma campanha pelo ID
 *     description: Retorna os dados completos de uma campanha específica
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da campanha
 *         example: "3f5b4db1-2f13-4d97-bf39-6b1f234abc99"
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
 *                   $ref: '#/components/schemas/CampanhaCompleta'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "ID inválido"
 *       404:
 *         description: Campanha não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Campanha não encontrada"
 */

/**
 * @swagger
 * /campanhas:
 *   post:
 *     summary: Cria uma nova campanha promocional
 *     description: Cria uma nova campanha com validação de dados e verificação de nome único
 *     tags: [Campanhas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampanhaCadastro'
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
 *                   $ref: '#/components/schemas/CampanhaCompleta'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Nome deve ter no mínimo 3 caracteres"
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido"
 *       409:
 *         description: Nome de campanha já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Já existe uma campanha com este nome"
 */

/**
 * @swagger
 * /campanhas/{id}:
 *   patch:
 *     summary: Atualiza uma campanha existente
 *     description: Atualiza parcialmente os dados de uma campanha com validação
 *     tags: [Campanhas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da campanha
 *         example: "3f5b4db1-2f13-4d97-bf39-6b1f234abc99"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampanhaAtualizar'
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
 *                   $ref: '#/components/schemas/CampanhaCompleta'
 *       400:
 *         description: Dados inválidos ou ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Pelo menos um campo deve ser informado para atualização"
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token inválido"
 *       404:
 *         description: Campanha não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Campanha não encontrada"
 *       409:
 *         description: Nome de campanha já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Já existe uma campanha com este nome"
 */

/**
 * @swagger
 * /campanhas/{id}:
 *   delete:
 *     summary: Deleta uma campanha (soft delete)
 *     description: Remove logicamente uma campanha do sistema sem deletar os dados permanentemente
 *     tags: [Campanhas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da campanha
 *         example: "3f5b4db1-2f13-4d97-bf39-6b1f234abc99"
 *     responses:
 *       200:
 *         description: Campanha deletada com sucesso
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
 *                   example: "Campanha deletada com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "ID inválido"
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido"
 *       404:
 *         description: Campanha não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Campanha não encontrada"
 */
