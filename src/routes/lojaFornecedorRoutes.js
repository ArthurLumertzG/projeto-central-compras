const express = require("express");
const router = express.Router();
const lojaFornecedorController = require("../controllers/lojaFornecedorController");
const asyncHandler = require("../middlewares/asyncHandler");
const { authenticate } = require("../middlewares/authMiddleware");

// Rotas públicas (consulta)
router.get("/", asyncHandler(lojaFornecedorController.getAll.bind(lojaFornecedorController)));
router.get("/loja/:loja_id", asyncHandler(lojaFornecedorController.getFornecedoresByLojaId.bind(lojaFornecedorController)));
router.get("/fornecedor/:fornecedor_id", asyncHandler(lojaFornecedorController.getLojasByFornecedorId.bind(lojaFornecedorController)));

// Rotas privadas (requerem autenticação JWT)
router.post("/", authenticate, asyncHandler(lojaFornecedorController.create.bind(lojaFornecedorController)));
router.delete("/:loja_id/:fornecedor_id", authenticate, asyncHandler(lojaFornecedorController.delete.bind(lojaFornecedorController)));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     LojaFornecedorCadastro:
 *       type: object
 *       required:
 *         - loja_id
 *         - fornecedor_id
 *       description: Dados para vincular um fornecedor a uma loja
 *       properties:
 *         loja_id:
 *           type: string
 *           format: uuid
 *           description: UUID da loja
 *           example: "7a6cc128-2c5f-6ec0-235a-cd2bfa780145"
 *         fornecedor_id:
 *           type: string
 *           format: uuid
 *           description: UUID do fornecedor
 *           example: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *
 *     LojaFornecedorCompleto:
 *       type: object
 *       description: Representa um vínculo loja-fornecedor completo
 *       properties:
 *         loja_id:
 *           type: string
 *           format: uuid
 *           description: UUID da loja
 *           example: "7a6cc128-2c5f-6ec0-235a-cd2bfa780145"
 *         fornecedor_id:
 *           type: string
 *           format: uuid
 *           description: UUID do fornecedor
 *           example: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *         loja_nome:
 *           type: string
 *           description: Nome da loja
 *           example: "Loja Central"
 *         loja_cnpj:
 *           type: string
 *           description: CNPJ da loja
 *           example: "12345678000190"
 *         fornecedor_descricao:
 *           type: string
 *           description: Descrição do fornecedor
 *           example: "Fornecedor de materiais de escritório"
 *         fornecedor_cnpj:
 *           type: string
 *           description: CNPJ do fornecedor
 *           example: "98765432000101"
 *         criado_em:
 *           type: string
 *           format: date-time
 *           description: Data de criação do vínculo
 *           example: "2024-10-18T10:00:00.000Z"
 *         atualizado_em:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-10-18T10:00:00.000Z"
 *
 *     FornecedorDaLoja:
 *       type: object
 *       description: Dados de um fornecedor vinculado a uma loja
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: UUID do fornecedor
 *           example: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *         cnpj:
 *           type: string
 *           description: CNPJ do fornecedor (14 dígitos)
 *           example: "98765432000101"
 *         descricao:
 *           type: string
 *           description: Descrição do fornecedor
 *           example: "Fornecedor de materiais de escritório"
 *         usuario_id:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário responsável
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         vinculado_em:
 *           type: string
 *           format: date-time
 *           description: Data em que foi vinculado à loja
 *           example: "2024-10-18T10:00:00.000Z"
 *
 *     LojaDoFornecedor:
 *       type: object
 *       description: Dados de uma loja atendida por um fornecedor
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: UUID da loja
 *           example: "7a6cc128-2c5f-6ec0-235a-cd2bfa780145"
 *         nome:
 *           type: string
 *           description: Nome da loja
 *           example: "Loja Central"
 *         cnpj:
 *           type: string
 *           description: CNPJ da loja (14 dígitos)
 *           example: "12345678000190"
 *         usuario_id:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário responsável
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         endereco_id:
 *           type: string
 *           format: uuid
 *           description: UUID do endereço da loja
 *           example: "c1d2e3f4-a5b6-7890-1234-567890fedcba"
 *         vinculado_em:
 *           type: string
 *           format: date-time
 *           description: Data em que foi vinculada ao fornecedor
 *           example: "2024-10-18T10:00:00.000Z"
 */

/**
 * @swagger
 * /loja-fornecedor:
 *   get:
 *     summary: Lista todos os vínculos loja-fornecedor
 *     description: Retorna todos os vínculos ativos entre lojas e fornecedores
 *     tags: [Loja-Fornecedor]
 *     responses:
 *       200:
 *         description: Lista de vínculos retornada com sucesso
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
 *                   example: "Vínculos encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LojaFornecedorCompleto'
 */

/**
 * @swagger
 * /loja-fornecedor/loja/{loja_id}:
 *   get:
 *     summary: Busca todos os fornecedores de uma loja
 *     description: Retorna a lista de fornecedores vinculados a uma loja específica
 *     tags: [Loja-Fornecedor]
 *     parameters:
 *       - in: path
 *         name: loja_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da loja
 *         example: "7a6cc128-2c5f-6ec0-235a-cd2bfa780145"
 *     responses:
 *       200:
 *         description: Fornecedores encontrados com sucesso
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
 *                   example: "Fornecedores encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FornecedorDaLoja'
 *       400:
 *         description: ID da loja inválido
 *       404:
 *         description: Loja não encontrada
 */

/**
 * @swagger
 * /loja-fornecedor/fornecedor/{fornecedor_id}:
 *   get:
 *     summary: Busca todas as lojas atendidas por um fornecedor
 *     description: Retorna a lista de lojas vinculadas a um fornecedor específico
 *     tags: [Loja-Fornecedor]
 *     parameters:
 *       - in: path
 *         name: fornecedor_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do fornecedor
 *         example: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *     responses:
 *       200:
 *         description: Lojas encontradas com sucesso
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
 *                   example: "Lojas encontradas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LojaDoFornecedor'
 *       400:
 *         description: ID do fornecedor inválido
 *       404:
 *         description: Fornecedor não encontrado
 */

/**
 * @swagger
 * /loja-fornecedor:
 *   post:
 *     summary: Vincula um fornecedor a uma loja
 *     description: Cria um novo vínculo entre loja e fornecedor. Requer autenticação JWT e que a loja pertença ao usuário.
 *     tags: [Loja-Fornecedor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LojaFornecedorCadastro'
 *     responses:
 *       201:
 *         description: Fornecedor vinculado à loja com sucesso
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
 *                   example: "Fornecedor vinculado à loja com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/LojaFornecedorCompleto'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Loja não pertence ao usuário autenticado
 *       404:
 *         description: Loja ou fornecedor não encontrado
 *       409:
 *         description: Fornecedor já está vinculado a esta loja
 */

/**
 * @swagger
 * /loja-fornecedor/{loja_id}/{fornecedor_id}:
 *   delete:
 *     summary: Desvincula um fornecedor de uma loja
 *     description: Remove o vínculo entre loja e fornecedor (soft delete). Requer autenticação JWT e que a loja pertença ao usuário.
 *     tags: [Loja-Fornecedor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loja_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da loja
 *         example: "7a6cc128-2c5f-6ec0-235a-cd2bfa780145"
 *       - in: path
 *         name: fornecedor_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do fornecedor
 *         example: "9b8a7c6d-5e4f-3210-1234-abcdef987654"
 *     responses:
 *       200:
 *         description: Fornecedor desvinculado da loja com sucesso
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
 *                   example: "Fornecedor desvinculado da loja com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: IDs inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Loja não pertence ao usuário autenticado
 *       404:
 *         description: Vínculo não encontrado
 */
