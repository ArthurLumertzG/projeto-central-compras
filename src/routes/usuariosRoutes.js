const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const asyncHandler = require("../middlewares/asyncHandler");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/login", asyncHandler(usuariosController.login));
router.post("/cadastro", asyncHandler(usuariosController.create));
router.get("/", authenticate, asyncHandler(usuariosController.getAll));
router.get("/:id", authenticate, asyncHandler(usuariosController.getById));
router.get("/email/:email", authenticate, asyncHandler(usuariosController.getByEmail));
router.patch("/:id", authenticate, asyncHandler(usuariosController.update));
router.put("/:id/senha", authenticate, asyncHandler(usuariosController.updatePassword));
router.delete("/:id", authenticate, asyncHandler(usuariosController.delete));

module.exports = router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT obtido através do login ou cadastro
 *   schemas:
 *     UsuarioCadastro:
 *       type: object
 *       required:
 *         - nome
 *         - sobrenome
 *         - email
 *         - senha
 *         - confirmedPassword
 *       description: Dados necessários para cadastro de um novo usuário.
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nome do usuário
 *           example: "João"
 *         sobrenome:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Sobrenome do usuário
 *           example: "Silva"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           description: Email do usuário (será convertido para lowercase)
 *           example: "joao.silva@example.com"
 *         senha:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           description: Senha forte (mín. 8 caracteres, deve conter maiúscula, minúscula, número e caractere especial)
 *           example: "Senha@123"
 *         confirmedPassword:
 *           type: string
 *           format: password
 *           description: Confirmação da senha (deve ser igual ao campo senha)
 *           example: "Senha@123"
 *         telefone:
 *           type: string
 *           minLength: 10
 *           maxLength: 20
 *           description: Telefone no formato internacional (opcional)
 *           example: "+5511999999999"
 *         funcao:
 *           type: string
 *           maxLength: 100
 *           description: Função/cargo do usuário (opcional)
 *           example: "Gerente de Compras"
 *         endereco_id:
 *           type: string
 *           format: uuid
 *           description: ID do endereço do usuário (opcional)
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *     UsuarioAtualizar:
 *       type: object
 *       description: Dados para atualização de perfil (todos os campos são opcionais).
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nome do usuário
 *           example: "João Pedro"
 *         sobrenome:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Sobrenome do usuário
 *           example: "Silva Santos"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           description: Email do usuário (marcará email_verificado como false se alterado)
 *           example: "joao.pedro@example.com"
 *         telefone:
 *           type: string
 *           minLength: 10
 *           maxLength: 20
 *           description: Telefone no formato internacional
 *           example: "+5511888888888"
 *         funcao:
 *           type: string
 *           maxLength: 100
 *           description: Função/cargo do usuário
 *           example: "Diretor de Compras"
 *         endereco_id:
 *           type: string
 *           format: uuid
 *           description: ID do endereço do usuário
 *           example: "b1234567-89ab-cdef-0123-456789abcdef"
 *     AtualizarSenha:
 *       type: object
 *       required:
 *         - senhaAtual
 *         - novaSenha
 *         - confirmedPassword
 *       description: Dados para atualização de senha.
 *       properties:
 *         senhaAtual:
 *           type: string
 *           format: password
 *           description: Senha atual do usuário
 *           example: "SenhaAntiga@123"
 *         novaSenha:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           description: Nova senha (deve ser diferente da atual e atender requisitos de complexidade)
 *           example: "NovaSenha@456"
 *         confirmedPassword:
 *           type: string
 *           format: password
 *           description: Confirmação da nova senha
 *           example: "NovaSenha@456"
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       description: Credenciais para login do usuário.
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "joao.silva@example.com"
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *           example: "Senha@123"
 *     UsuarioPublico:
 *       type: object
 *       description: Dados públicos do usuário (sem campos sensíveis como senha).
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do usuário
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "João"
 *         sobrenome:
 *           type: string
 *           description: Sobrenome do usuário
 *           example: "Silva"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "joao.silva@example.com"
 *         email_verificado:
 *           type: boolean
 *           description: Indica se o email foi verificado
 *           example: true
 *         telefone:
 *           type: string
 *           description: Telefone do usuário
 *           example: "+5511999999999"
 *         funcao:
 *           type: string
 *           description: Função/cargo do usuário
 *           example: "Gerente de Compras"
 *         endereco_id:
 *           type: string
 *           format: uuid
 *           description: ID do endereço do usuário
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *         criado_em:
 *           type: string
 *           format: date-time
 *           description: Data de criação do usuário
 *           example: "2025-10-18T10:30:00.000Z"
 *         atualizado_em:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2025-10-18T15:45:00.000Z"
 *     TokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT para autenticação
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOTM4MzU0OS0xM2YxLTQ0OWEtOWIwYS02YzcyZmNlNGRjZWUiLCJub21lIjoiSm_Do28iLCJzb2JyZW5vbWUiOiJTaWx2YSIsImVtYWlsIjoiam9hby5zaWx2YUBleGFtcGxlLmNvbSIsImZ1bmNhbyI6IkdlcmVudGUgZGUgQ29tcHJhcyIsImVtYWlsX3ZlcmlmaWNhZG8iOnRydWUsImlhdCI6MTY5NzYzMjgwMCwiZXhwIjoxNjk3NzE5MjAwfQ.abc123def456"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Mensagem de erro"
 *         data:
 *           type: null
 *           example: null
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operação realizada com sucesso"
 *         data:
 *           type: object
 */

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realiza login do usuário
 *     description: Autentica o usuário com email e senha, retornando um token JWT para uso em requisições protegidas
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
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
 *                   example: "Login realizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               emailInvalido:
 *                 value:
 *                   success: false
 *                   message: "Email inválido"
 *                   data: null
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               credenciaisInvalidas:
 *                 value:
 *                   success: false
 *                   message: "Credenciais inválidas"
 *                   data: null
 *       403:
 *         description: Email não verificado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               emailNaoVerificado:
 *                 value:
 *                   success: false
 *                   message: "Email não verificado. Verifique seu email antes de fazer login."
 *                   data: null
 */

/**
 * @swagger
 * /usuarios/cadastro:
 *   post:
 *     summary: Cadastra um novo usuário
 *     description: Cria um novo usuário no sistema e retorna um token JWT para autenticação imediata
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCadastro'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
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
 *                   example: "Usuário criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               senhaFraca:
 *                 value:
 *                   success: false
 *                   message: "Senha deve ter pelo menos 8 caracteres"
 *                   data: null
 *               senhasNaoCoincidem:
 *                 value:
 *                   success: false
 *                   message: "As senhas não coincidem"
 *                   data: null
 *               campoObrigatorio:
 *                 value:
 *                   success: false
 *                   message: "Nome é obrigatório"
 *                   data: null
 *       409:
 *         description: Já existe um usuário com este email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Já existe um usuário com este email"
 *               data: null
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados (sem senhas)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
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
 *                   example: "Usuários encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UsuarioPublico'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tokenNaoFornecido:
 *                 value:
 *                   success: false
 *                   message: "Token não fornecido"
 *                   data: null
 *               tokenInvalido:
 *                 value:
 *                   success: false
 *                   message: "Token inválido"
 *                   data: null
 *               tokenExpirado:
 *                 value:
 *                   success: false
 *                   message: "Token expirado"
 *                   data: null
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     description: Retorna os dados de um usuário específico (sem senha)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário (formato UUID)
 *         example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
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
 *                   example: "Usuário encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/UsuarioPublico'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "ID inválido"
 *               data: null
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Usuário não encontrado"
 *               data: null
 */

/**
 * @swagger
 * /usuarios/email/{email}:
 *   get:
 *     summary: Busca um usuário pelo email
 *     description: Retorna os dados de um usuário específico através do seu email (sem senha)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email do usuário
 *         example: "joao.silva@example.com"
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
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
 *                   example: "Usuário encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/UsuarioPublico'
 *       400:
 *         description: Email inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Email inválido"
 *               data: null
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Usuário não encontrado"
 *               data: null
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   patch:
 *     summary: Atualiza dados do usuário
 *     description: Permite que o usuário autenticado atualize seus próprios dados (não pode atualizar outros usuários)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário a ser atualizado (deve ser o mesmo do token JWT)
 *         example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioAtualizar'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
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
 *                   example: "Usuário atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/UsuarioPublico'
 *       400:
 *         description: Dados inválidos ou pelo menos um campo deve ser fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               campoInvalido:
 *                 value:
 *                   success: false
 *                   message: "Email inválido"
 *                   data: null
 *               nenhumCampo:
 *                 value:
 *                   success: false
 *                   message: "Pelo menos um campo deve ser informado para atualização"
 *                   data: null
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sem permissão para atualizar este usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Você não tem permissão para atualizar este usuário"
 *               data: null
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email já está em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Este email já está em uso"
 *               data: null
 */

/**
 * @swagger
 * /usuarios/{id}/senha:
 *   put:
 *     summary: Atualiza a senha do usuário
 *     description: Permite que o usuário autenticado altere sua própria senha (requer senha atual)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário (deve ser o mesmo do token JWT)
 *         example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarSenha'
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
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
 *                   example: "Senha atualizada com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               senhaFraca:
 *                 value:
 *                   success: false
 *                   message: "Nova senha deve ter pelo menos 8 caracteres"
 *                   data: null
 *               senhasNaoCoincidem:
 *                 value:
 *                   success: false
 *                   message: "As senhas não coincidem"
 *                   data: null
 *               mesmasenha:
 *                 value:
 *                   success: false
 *                   message: "Nova senha deve ser diferente da senha atual"
 *                   data: null
 *       401:
 *         description: Não autenticado ou senha atual incorreta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               naoAutenticado:
 *                 value:
 *                   success: false
 *                   message: "Usuário não autenticado"
 *                   data: null
 *               senhaIncorreta:
 *                 value:
 *                   success: false
 *                   message: "Senha atual incorreta"
 *                   data: null
 *       403:
 *         description: Sem permissão para alterar senha deste usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Você não tem permissão para alterar a senha deste usuário"
 *               data: null
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário (soft delete)
 *     description: Permite que o usuário autenticado delete sua própria conta. O usuário não é removido fisicamente do banco, apenas marcado como deletado.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário a ser deletado (deve ser o mesmo do token JWT)
 *         example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
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
 *                   example: "Usuário deletado com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "ID inválido"
 *               data: null
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Usuário não autenticado"
 *               data: null
 *       403:
 *         description: Sem permissão para deletar este usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Você não tem permissão para deletar este usuário"
 *               data: null
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Usuário não encontrado"
 *               data: null
 *       500:
 *         description: Erro ao deletar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Erro ao deletar usuário"
 *               data: null
 */
