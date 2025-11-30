const express = require("express");
const LojasController = require("../controllers/lojasController");
const asyncHandler = require("../middlewares/asyncHandler");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();
const lojasController = new LojasController();

/**
 * @swagger
 * components:
 *   schemas:
 *     LojaCadastro:
 *       type: object
 *       required:
 *         - nome
 *         - cnpj
 *         - usuario_id
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           description: Nome da loja
 *           example: "Loja Matriz - Centro"
 *         cnpj:
 *           type: string
 *           pattern: '^\d{14}$'
 *           description: CNPJ da loja (14 dígitos sem formatação)
 *           example: "12345678000190"
 *         usuario_id:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário responsável pela loja
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         endereco_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: UUID do endereço da loja (opcional)
 *           example: "660e8400-e29b-41d4-a716-446655440001"
 *
 *     LojaAtualizar:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           description: Nome da loja
 *           example: "Loja Matriz - Centro Atualizada"
 *         cnpj:
 *           type: string
 *           pattern: '^\d{14}$'
 *           description: CNPJ da loja (14 dígitos sem formatação)
 *           example: "12345678000190"
 *         usuario_id:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário responsável
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         endereco_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: UUID do endereço da loja
 *           example: "660e8400-e29b-41d4-a716-446655440001"
 *
 *     LojaCompleto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: UUID da loja
 *           example: "770e8400-e29b-41d4-a716-446655440002"
 *         nome:
 *           type: string
 *           description: Nome da loja
 *           example: "Loja Matriz - Centro"
 *         cnpj:
 *           type: string
 *           description: CNPJ da loja (14 dígitos)
 *           example: "12345678000190"
 *         usuario_id:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário responsável
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         endereco_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: UUID do endereço da loja
 *           example: "660e8400-e29b-41d4-a716-446655440001"
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
 *   responses:
 *     LojaSuccess:
 *       description: Operação realizada com sucesso
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 $ref: '#/components/schemas/LojaCompleto'
 *               message:
 *                 type: string
 *                 example: "Loja criada com sucesso"
 *
 *     LojasListSuccess:
 *       description: Lista de lojas recuperada com sucesso
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/LojaCompleto'
 *               message:
 *                 type: string
 *                 example: "Lojas recuperadas com sucesso"
 *
 *     LojaNotFound:
 *       description: Loja não encontrada
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Loja não encontrada"
 *
 *     LojaBadRequest:
 *       description: Dados de entrada inválidos
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Erro de validação: Nome é obrigatório, CNPJ deve conter 14 dígitos"
 *
 *     LojaConflict:
 *       description: CNPJ já cadastrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Já existe uma loja cadastrada com este CNPJ"
 *
 *     UsuarioNotFound:
 *       description: Usuário não encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Usuário não encontrado. Use um usuário válido."
 *
 *     EnderecoNotFound:
 *       description: Endereço não encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Endereço não encontrado. Crie ou use um endereço válido."
 *
 *     Unauthorized:
 *       description: Token de autenticação ausente ou inválido
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Token não fornecido"
 *
 * /lojas:
 *   get:
 *     summary: Lista todas as lojas ativas
 *     description: Retorna todas as lojas cadastradas que não foram deletadas (soft delete)
 *     tags: [Lojas]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LojasListSuccess'
 *       500:
 *         description: Erro interno do servidor
 *
 *   post:
 *     summary: Cria uma nova loja
 *     description: |
 *       Cria uma nova loja com validações completas:
 *       - Nome obrigatório (2-200 caracteres)
 *       - CNPJ obrigatório (14 dígitos, único)
 *       - usuario_id obrigatório (deve existir no banco)
 *       - endereco_id opcional (se fornecido, deve existir no banco)
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LojaCadastro'
 *           examples:
 *             ComEndereco:
 *               summary: Loja com endereço
 *               value:
 *                 nome: "Loja Matriz - Centro"
 *                 cnpj: "12345678000190"
 *                 usuario_id: "550e8400-e29b-41d4-a716-446655440000"
 *                 endereco_id: "660e8400-e29b-41d4-a716-446655440001"
 *             SemEndereco:
 *               summary: Loja sem endereço
 *               value:
 *                 nome: "Loja Filial - Norte"
 *                 cnpj: "98765432000110"
 *                 usuario_id: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       201:
 *         $ref: '#/components/responses/LojaSuccess'
 *       400:
 *         $ref: '#/components/responses/LojaBadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Usuário ou endereço não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/UsuarioNotFound'
 *                 - $ref: '#/components/responses/EnderecoNotFound'
 *       409:
 *         $ref: '#/components/responses/LojaConflict'
 *       500:
 *         description: Erro interno do servidor
 *
 * /lojas/{id}:
 *   get:
 *     summary: Busca uma loja por ID
 *     description: Retorna os dados completos de uma loja específica pelo UUID
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da loja
 *         example: "770e8400-e29b-41d4-a716-446655440002"
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LojaSuccess'
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
 *                   example: "ID da loja inválido"
 *       404:
 *         $ref: '#/components/responses/LojaNotFound'
 *       500:
 *         description: Erro interno do servidor
 *
 *   patch:
 *     summary: Atualiza uma loja existente
 *     description: |
 *       Atualiza parcialmente uma loja existente. Campos validados:
 *       - nome: 2-200 caracteres
 *       - cnpj: 14 dígitos (verifica unicidade se alterado)
 *       - usuario_id: deve existir no banco
 *       - endereco_id: deve existir no banco se fornecido
 *
 *       Mínimo de 1 campo obrigatório para atualização
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da loja
 *         example: "770e8400-e29b-41d4-a716-446655440002"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LojaAtualizar'
 *           examples:
 *             ApenasNome:
 *               summary: Atualizar apenas nome
 *               value:
 *                 nome: "Loja Matriz - Centro Renovada"
 *             NomeECNPJ:
 *               summary: Atualizar nome e CNPJ
 *               value:
 *                 nome: "Nova Loja Matriz"
 *                 cnpj: "11122233000144"
 *             TodosCampos:
 *               summary: Atualizar todos os campos
 *               value:
 *                 nome: "Loja Completa Atualizada"
 *                 cnpj: "55566677000188"
 *                 usuario_id: "550e8400-e29b-41d4-a716-446655440099"
 *                 endereco_id: "660e8400-e29b-41d4-a716-446655440099"
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LojaSuccess'
 *       400:
 *         $ref: '#/components/responses/LojaBadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Loja, usuário ou endereço não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/LojaNotFound'
 *                 - $ref: '#/components/responses/UsuarioNotFound'
 *                 - $ref: '#/components/responses/EnderecoNotFound'
 *       409:
 *         $ref: '#/components/responses/LojaConflict'
 *       500:
 *         description: Erro interno do servidor
 *
 *   delete:
 *     summary: Deleta uma loja (soft delete)
 *     description: |
 *       Realiza exclusão lógica (soft delete) de uma loja.
 *       A loja não é removida do banco, apenas marcada como deletada com timestamp.
 *       Lojas deletadas não aparecem em listagens.
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da loja
 *         example: "770e8400-e29b-41d4-a716-446655440002"
 *     responses:
 *       200:
 *         description: Loja deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Loja deletada com sucesso"
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
 *                   example: "ID da loja inválido"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/LojaNotFound'
 *       500:
 *         description: Erro interno do servidor
 */

// Rotas públicas
router.get("/", asyncHandler(lojasController.getAll.bind(lojasController)));
router.get("/:id", asyncHandler(lojasController.getById.bind(lojasController)));

// Rotas privadas (requerem autenticação)
router.get("/minhas/lojas", authenticate, asyncHandler(lojasController.getMinhasLojas.bind(lojasController)));
router.get("/usuario/:usuario_id", asyncHandler(lojasController.getByUsuarioId.bind(lojasController)));
router.post("/", authenticate, asyncHandler(lojasController.create.bind(lojasController)));
router.patch("/:id", authenticate, asyncHandler(lojasController.update.bind(lojasController)));
router.delete("/:id", authenticate, asyncHandler(lojasController.delete.bind(lojasController)));

module.exports = router;
