const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", asyncHandler(usuariosController.getAll));
router.post("/login", asyncHandler(usuariosController.login));
router.get("/:id", asyncHandler(usuariosController.getById));
router.get("/email/:email", asyncHandler(usuariosController.getByEmail));
router.post("/", asyncHandler(usuariosController.create));
router.patch("/:id", asyncHandler(usuariosController.update));
router.delete("/:id", asyncHandler(usuariosController.delete));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - user
 *         - password
 *         - confirmedPassword
 *         - level
 *       description: Representa um usuário na central de compras.
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do usuário gerado automaticamente
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "Carlos Webber"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "usuario@teste.com"
 *         user:
 *           type: string
 *           description: Nome de usuário para login
 *           example: "carlos.webber"
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *           example: "senha123"
 *         confirmedPassword:
 *           type: string
 *           format: password
 *           description: Confirmação da senha do usuário
 *           example: "senha123"
 *         level:
 *           type: string
 *           description: Nível de acesso do usuário
 *           example: "admin"
 *         status:
 *           type: string
 *           description: Status do usuário
 *           example: "on"
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - user
 *         - password
 *         - confirmedPassword
 *         - level
 *       description: Schema para criação e atualização de usuário (sem ID).
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "Carlos Webber"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "usuario@teste.com"
 *         user:
 *           type: string
 *           description: Nome de usuário para login
 *           example: "carlos.webber"
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *           example: "senha123"
 *         confirmedPassword:
 *           type: string
 *           format: password
 *           description: Confirmação da senha do usuário
 *           example: "senha123"
 *         level:
 *           type: string
 *           description: Nível de acesso do usuário
 *           example: "admin"
 *         status:
 *           type: string
 *           description: Status do usuário
 *           example: "on"
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       description: Credenciais para login do usuário.
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "usuario@teste.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *           example: "senha123"
 *     UsuarioPublic:
 *       type: object
 *       description: Representa um usuário exposto em respostas (sem campos sensíveis).
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do usuário
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "Carlos Webber"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "usuario@teste.com"
 *         user:
 *           type: string
 *           description: Nome de usuário
 *           example: "carlos.webber"
 *         level:
 *           type: string
 *           description: Nível de acesso do usuário
 *           example: "admin"
 *         status:
 *           type: string
 *           description: Status do usuário
 *           example: "on"
 */

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realiza login do usuário
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
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT Token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOTM4MzU0OS0xM2YxLTQ0OWEtOWIwYS02YzcyZmNlNGRjZWUiLCJlbWFpbCI6InVzdWFyaW9AdGVzdGUuY29tIiwibGV2ZWwiOiJhZG1pbiIsInN0YXR1cyI6Im9uIiwiaWF0IjoxNjk1NjYzNjAwLCJleHAiOjE2OTU2NjcyMDB9.abcdefghijklmnopqrstuvwxyz123456"
 *       401:
 *         description: Usuário ou senha inválidos
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
 *                   example: "Usuário ou senha inválidos"
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
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
 *                     $ref: '#/components/schemas/UsuarioPublic'
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
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
 *                   $ref: '#/components/schemas/UsuarioPublic'
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/email/{email}:
 *   get:
 *     summary: Busca um usuário pelo email
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email do usuário
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
 *                   $ref: '#/components/schemas/UsuarioPublic'
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
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
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT Token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Já existe um usuário com este email
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   patch:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
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
 *                   $ref: '#/components/schemas/UsuarioPublic'
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
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
 *       404:
 *         description: Usuário não encontrado
 */
