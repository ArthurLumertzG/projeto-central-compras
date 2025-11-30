const express = require("express");
const router = express.Router();
const enderecosController = require("../controllers/enderecosController");
const asyncHandler = require("../middlewares/asyncHandler");
const { authenticate } = require("../middlewares/authMiddleware");

// Rotas públicas (necessário para criar endereço antes de criar usuário)
router.get("/", asyncHandler(enderecosController.getAll));
router.get("/:id", asyncHandler(enderecosController.getById));
router.get("/cep/:cep", asyncHandler(enderecosController.getByCep));
router.get("/cidade/:cidade/estado/:estado", asyncHandler(enderecosController.getByCidadeEstado));
router.post("/", asyncHandler(enderecosController.create)); // Público para permitir cadastro

// Rotas privadas (com autenticação)
router.patch("/:id", authenticate, asyncHandler(enderecosController.update));
router.delete("/:id", authenticate, asyncHandler(enderecosController.delete));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     EnderecoCadastro:
 *       type: object
 *       required:
 *         - estado
 *         - cidade
 *         - bairro
 *         - rua
 *         - numero
 *         - cep
 *       description: Schema para cadastro de novo endereço
 *       properties:
 *         estado:
 *           type: string
 *           length: 2
 *           pattern: '^[A-Z]{2}$'
 *           description: Sigla do estado (2 caracteres maiúsculos)
 *           example: "SP"
 *         cidade:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nome da cidade
 *           example: "São Paulo"
 *         bairro:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nome do bairro
 *           example: "Centro"
 *         rua:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           description: Nome da rua/avenida
 *           example: "Rua das Flores"
 *         numero:
 *           type: string
 *           maxLength: 10
 *           description: Número do endereço (pode ser "S/N")
 *           example: "123"
 *         complemento:
 *           type: string
 *           maxLength: 100
 *           nullable: true
 *           description: Complemento opcional (apto, sala, etc)
 *           example: "Apto 45"
 *         cep:
 *           type: string
 *           pattern: '^\d{5}-?\d{3}$'
 *           description: CEP (com ou sem hífen)
 *           example: "01234-567"
 *
 *     EnderecoAtualizar:
 *       type: object
 *       minProperties: 1
 *       description: Schema para atualização de endereço (todos campos opcionais, mas ao menos 1 obrigatório)
 *       properties:
 *         estado:
 *           type: string
 *           length: 2
 *           pattern: '^[A-Z]{2}$'
 *           description: Sigla do estado
 *           example: "RJ"
 *         cidade:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nome da cidade
 *           example: "Rio de Janeiro"
 *         bairro:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nome do bairro
 *           example: "Copacabana"
 *         rua:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           description: Nome da rua
 *           example: "Avenida Atlântica"
 *         numero:
 *           type: string
 *           maxLength: 10
 *           description: Número do endereço
 *           example: "456"
 *         complemento:
 *           type: string
 *           maxLength: 100
 *           nullable: true
 *           description: Complemento
 *           example: "Casa 2"
 *         cep:
 *           type: string
 *           pattern: '^\d{5}-?\d{3}$'
 *           description: CEP
 *           example: "22070-000"
 *
 *     EnderecoCompleto:
 *       allOf:
 *         - $ref: '#/components/schemas/EnderecoCadastro'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: UUID único do endereço (gerado automaticamente)
 *               example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *             criado_em:
 *               type: string
 *               format: date-time
 *               description: Data e hora de criação do registro
 *               example: "2025-01-15T10:30:00.000Z"
 *             atualizado_em:
 *               type: string
 *               format: date-time
 *               description: Data e hora da última atualização
 *               example: "2025-01-15T14:45:30.000Z"
 *             deletado_em:
 *               type: string
 *               format: date-time
 *               nullable: true
 *               description: Data e hora de exclusão (soft delete), null se ativo
 *               example: null
 */

/**
 * @swagger
 * /enderecos:
 *   get:
 *     summary: Lista todos os endereços ativos (não deletados)
 *     description: Retorna lista de todos os endereços disponíveis no sistema. Endereços com soft delete não são exibidos.
 *     tags: [Endereços]
 *     responses:
 *       200:
 *         description: Lista de endereços retornada com sucesso (pode ser vazia)
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
 *                   example: "Endereços encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EnderecoCompleto'
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /enderecos/{id}:
 *   get:
 *     summary: Busca um endereço específico por ID
 *     description: Retorna os dados completos de um endereço através do seu UUID
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do endereço
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Endereço encontrado com sucesso
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
 *                   example: "Endereço encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/EnderecoCompleto'
 *       400:
 *         description: ID inválido (não é um UUID válido)
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /enderecos/cep/{cep}:
 *   get:
 *     summary: Busca endereços por CEP
 *     description: Retorna todos os endereços com o CEP informado (aceita com ou sem hífen)
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{5}-?\d{3}$'
 *         description: CEP (com ou sem hífen)
 *         example: "01234-567"
 *     responses:
 *       200:
 *         description: Endereços encontrados (pode ser lista vazia)
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
 *                   example: "Endereços encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EnderecoCompleto'
 *       400:
 *         description: CEP inválido
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /enderecos/cidade/{cidade}/estado/{estado}:
 *   get:
 *     summary: Busca endereços por cidade e estado
 *     description: Retorna todos os endereços de uma cidade/estado específico
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: cidade
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da cidade
 *         example: "São Paulo"
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           length: 2
 *         description: Sigla do estado (2 caracteres)
 *         example: "SP"
 *     responses:
 *       200:
 *         description: Endereços encontrados (pode ser lista vazia)
 *       400:
 *         description: Parâmetros inválidos
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /enderecos:
 *   post:
 *     summary: Cria um novo endereço
 *     description: Cadastra um novo endereço no sistema. ROTA PÚBLICA para permitir cadastro de usuários (que precisam criar endereço primeiro).
 *     tags: [Endereços]
 *     requestBody:
 *       required: true
 *       description: Dados do endereço a ser criado
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnderecoCadastro'
 *           example:
 *             estado: "SP"
 *             cidade: "São Paulo"
 *             bairro: "Centro"
 *             rua: "Rua das Flores"
 *             numero: "123"
 *             complemento: "Apto 45"
 *             cep: "01234-567"
 *     responses:
 *       201:
 *         description: Endereço criado com sucesso
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
 *                   example: "Endereço criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/EnderecoCompleto'
 *       400:
 *         description: Dados inválidos (campos obrigatórios faltando, formatos incorretos)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /enderecos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um endereço existente
 *     description: Atualiza um ou mais campos de um endereço. Requer autenticação via JWT.
 *     tags: [Endereços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do endereço a ser atualizado
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     requestBody:
 *       required: true
 *       description: Campos a serem atualizados (mínimo 1 campo)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnderecoAtualizar'
 *           example:
 *             numero: "456"
 *             complemento: "Casa 2"
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum campo fornecido
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /enderecos/{id}:
 *   delete:
 *     summary: Remove um endereço (soft delete)
 *     description: Marca um endereço como deletado sem removê-lo fisicamente. Requer autenticação via JWT.
 *     tags: [Endereços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do endereço a ser deletado
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Endereço deletado com sucesso (soft delete)
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Endereço não encontrado ou já foi deletado
 *       500:
 *         description: Erro interno do servidor
 */
