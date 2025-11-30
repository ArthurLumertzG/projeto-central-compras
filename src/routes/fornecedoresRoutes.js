const express = require("express");
const FornecedoresController = require("../controllers/fornecedoresController");
const asyncHandler = require("../middlewares/asyncHandler");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();
const fornecedoresController = new FornecedoresController();

// Rotas públicas
router.get("/", asyncHandler(fornecedoresController.getAll.bind(fornecedoresController)));
router.get("/:id", asyncHandler(fornecedoresController.getById.bind(fornecedoresController)));
router.get("/cnpj/:cnpj", asyncHandler(fornecedoresController.getByCnpj.bind(fornecedoresController)));

// Rotas privadas (requerem autenticação)
router.post("/", authenticate, asyncHandler(fornecedoresController.create.bind(fornecedoresController)));
router.patch("/:id", authenticate, asyncHandler(fornecedoresController.update.bind(fornecedoresController)));
router.delete("/:id", authenticate, asyncHandler(fornecedoresController.delete.bind(fornecedoresController)));

/**
 * @swagger
 * components:
 *   schemas:
 *     FornecedorCadastro:
 *       type: object
 *       required:
 *         - cnpj
 *         - descricao
 *         - usuario_id
 *       properties:
 *         cnpj:
 *           type: string
 *           pattern: '^\d{14}$'
 *           description: CNPJ do fornecedor (14 dígitos sem formatação)
 *           example: "12345678000190"
 *         descricao:
 *           type: string
 *           minLength: 2
 *           maxLength: 500
 *           description: Descrição do fornecedor
 *           example: "Fornecedor de equipamentos de informática e periféricos"
 *         usuario_id:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário responsável
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *
 *     FornecedorAtualizar:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         cnpj:
 *           type: string
 *           pattern: '^\d{14}$'
 *           description: CNPJ do fornecedor (14 dígitos)
 *           example: "98765432000110"
 *         descricao:
 *           type: string
 *           minLength: 2
 *           maxLength: 500
 *           description: Descrição do fornecedor
 *           example: "Fornecedor de equipamentos eletrônicos"
 *         usuario_id:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário responsável
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *
 *     FornecedorCompleto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: UUID do fornecedor
 *           example: "770e8400-e29b-41d4-a716-446655440002"
 *         cnpj:
 *           type: string
 *           description: CNPJ do fornecedor (14 dígitos)
 *           example: "12345678000190"
 *         descricao:
 *           type: string
 *           description: Descrição do fornecedor
 *           example: "Fornecedor de equipamentos de informática e periféricos"
 *         usuario_id:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário responsável
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         criado_em:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *           example: "2024-01-01T10:00:00.000Z"
 *         atualizado_em:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-15T14:30:00.000Z"
 *
 * /fornecedores:
 *   get:
 *     summary: Lista todos os fornecedores ativos
 *     description: Retorna todos os fornecedores cadastrados que não foram deletados
 *     tags: [Fornecedores]
 *     responses:
 *       200:
 *         description: Lista de fornecedores recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FornecedorCompleto'
 *                 message:
 *                   type: string
 *                   example: "Fornecedores recuperados com sucesso"
 *       500:
 *         description: Erro interno do servidor
 *
 *   post:
 *     summary: Cria um novo fornecedor
 *     description: Cria fornecedor com CNPJ único e usuario_id válido
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FornecedorCadastro'
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Usuário não encontrado
 *       409:
 *         description: CNPJ já cadastrado
 *
 * /fornecedores/{id}:
 *   get:
 *     summary: Busca fornecedor por ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Fornecedor não encontrado
 *
 *   patch:
 *     summary: Atualiza fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FornecedorAtualizar'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Fornecedor não encontrado
 *       409:
 *         description: CNPJ já cadastrado
 *
 *   delete:
 *     summary: Deleta fornecedor (soft delete)
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Fornecedor deletado
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Fornecedor não encontrado
 *
 * /fornecedores/cnpj/{cnpj}:
 *   get:
 *     summary: Busca fornecedor por CNPJ
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: cnpj
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{14}$'
 *         description: CNPJ (14 dígitos)
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *       400:
 *         description: CNPJ inválido
 *       404:
 *         description: Fornecedor não encontrado
 */

module.exports = router;
