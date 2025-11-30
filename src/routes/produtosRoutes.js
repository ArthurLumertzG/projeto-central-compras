const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");
const asyncHandler = require("../middlewares/asyncHandler");
const { authenticate } = require("../middlewares/authMiddleware");

// Rotas públicas (sem autenticação)
router.get("/", asyncHandler(produtosController.getAll));
router.get("/id/:id", asyncHandler(produtosController.getById));
router.get("/nome/:nome", asyncHandler(produtosController.getByName));

// Rotas privadas (com autenticação)
router.post("/", authenticate, asyncHandler(produtosController.create));
router.patch("/:id", authenticate, asyncHandler(produtosController.update));
router.delete("/:id", authenticate, asyncHandler(produtosController.delete));

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ProdutoCadastro:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - valor_unitario
 *         - quantidade_estoque
 *         - fornecedor_id
 *         - categoria
 *       description: Schema para cadastro de novo produto
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           description: Nome do produto
 *           example: "Notebook Gamer Dell G15"
 *         descricao:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           description: Descrição detalhada do produto
 *           example: "Notebook gamer com processador Intel Core i7 11ª geração, 16GB RAM DDR4, SSD 512GB NVMe, placa de vídeo NVIDIA RTX 3060 6GB, tela 15.6\" Full HD 120Hz"
 *         valor_unitario:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           description: Valor unitário do produto (sempre positivo, 2 casas decimais)
 *           example: 5499.90
 *         quantidade_estoque:
 *           type: integer
 *           minimum: 0
 *           description: Quantidade disponível em estoque (não pode ser negativo)
 *           example: 15
 *         fornecedor_id:
 *           type: string
 *           format: uuid
 *           description: UUID do fornecedor associado ao produto
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *         categoria:
 *           type: string
<<<<<<< HEAD
 *           minLength: 2
 *           maxLength: 100
 *           description: Categoria do produto
 *           example: "Informática"
 *
 *     ProdutoAtualizar:
 *       type: object
 *       minProperties: 1
 *       description: Schema para atualização de produto (todos campos opcionais, mas ao menos 1 obrigatório)
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           description: Nome do produto
 *           example: "Notebook Gamer Dell G15 Atualizado"
 *         descricao:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           description: Descrição detalhada do produto
 *           example: "Notebook gamer atualizado com mais RAM"
 *         valor_unitario:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           description: Valor unitário do produto
 *           example: 5299.90
 *         quantidade_estoque:
 *           type: integer
 *           minimum: 0
 *           description: Quantidade disponível em estoque
 *           example: 20
 *         fornecedor_id:
 *           type: string
 *           format: uuid
 *           description: UUID do fornecedor associado
 *           example: "b1234567-89ab-cdef-0123-456789abcdef"
 *         categoria:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Categoria do produto
 *           example: "Eletrônicos"
 *
 *     ProdutoCompleto:
 *       allOf:
 *         - $ref: '#/components/schemas/ProdutoCadastro'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: UUID único do produto (gerado automaticamente)
 *               example: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
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
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Mensagem de erro descritiva
 *           example: "Erro ao processar requisição"
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           description: Mensagem de sucesso descritiva
 *           example: "Operação realizada com sucesso"
 *         data:
 *           description: Dados retornados (pode ser null)
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT obtido no login (POST /usuarios/login)
=======
 *           description: Status do produto
 *           example: "ativo"
 *     ProdutoInput:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - preco
 *         - estoque
 *         - fornecedor_id
 *         - status
 *       description: Schema para criação e atualização de produto (sem ID).
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do produto
 *           example: "Notebook Gamer"
 *         descricao:
 *           type: string
 *           description: Descrição detalhada do produto
 *           example: "Notebook com processador i7, 16GB RAM, 512GB SSD"
 *         preco:
 *           type: number
 *           format: float
 *           description: Preço do produto
 *           example: 4599.90
 *         estoque:
 *           type: integer
 *           description: Quantidade em estoque
 *           example: 25
 *         fornecedor_id:
 *           type: string
 *           format: uuid
 *           description: ID do fornecedor associado ao produto
 *           example: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *         status:
 *           type: string
 *           description: Status do produto
 *           example: "ativo"
>>>>>>> main
 */

/**
 * @swagger
 * /produtos:
 *   get:
<<<<<<< HEAD
 *     summary: Lista todos os produtos ativos (não deletados)
 *     description: Retorna lista de todos os produtos disponíveis no sistema. Produtos com soft delete não são exibidos.
 *     tags: [Produtos]
=======
 *     summary: Lista todos os produtos
 *     tags: [Produtos - Arthur Lumertz Guimarães]
>>>>>>> main
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso (pode ser vazia)
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
 *                   example: "Produtos encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProdutoCompleto'
 *             examples:
 *               com_produtos:
 *                 summary: Lista com produtos
 *                 value:
 *                   success: true
 *                   message: "Produtos encontrados com sucesso"
 *                   data:
 *                     - id: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
 *                       nome: "Notebook Gamer Dell G15"
 *                       descricao: "Notebook gamer com processador Intel Core i7"
 *                       valor_unitario: 5499.90
 *                       quantidade_estoque: 15
 *                       fornecedor_id: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *                       categoria: "Informática"
 *                       criado_em: "2025-01-15T10:30:00.000Z"
 *                       atualizado_em: "2025-01-15T10:30:00.000Z"
 *                       deletado_em: null
 *               sem_produtos:
 *                 summary: Lista vazia
 *                 value:
 *                   success: true
 *                   message: "Nenhum produto encontrado"
 *                   data: []
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /produtos/id/{id}:
 *   get:
<<<<<<< HEAD
 *     summary: Busca um produto específico por ID
 *     description: Retorna os dados completos de um produto através do seu UUID
 *     tags: [Produtos]
=======
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos - Arthur Lumertz Guimarães]
>>>>>>> main
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do produto
 *         example: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
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
 *                   example: "Produto encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ProdutoCompleto'
 *             example:
 *               success: true
 *               message: "Produto encontrado com sucesso"
 *               data:
 *                 id: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
 *                 nome: "Notebook Gamer Dell G15"
 *                 descricao: "Notebook gamer com processador Intel Core i7"
 *                 valor_unitario: 5499.90
 *                 quantidade_estoque: 15
 *                 fornecedor_id: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *                 categoria: "Informática"
 *                 criado_em: "2025-01-15T10:30:00.000Z"
 *                 atualizado_em: "2025-01-15T10:30:00.000Z"
 *                 deletado_em: null
 *       400:
 *         description: ID inválido (não é um UUID válido)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "ID deve ser um UUID válido"
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Produto não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /produtos/nome/{nome}:
 *   get:
<<<<<<< HEAD
 *     summary: Busca um produto por nome (case-insensitive)
 *     description: Retorna os dados de um produto através do seu nome. A busca é case-insensitive.
 *     tags: [Produtos]
=======
 *     summary: Busca um produto pelo nome
 *     tags: [Produtos - Arthur Lumertz Guimarães]
>>>>>>> main
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         description: Nome do produto (busca exata, mas case-insensitive)
 *         example: "notebook gamer dell g15"
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
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
 *                   example: "Produto encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ProdutoCompleto'
 *             example:
 *               success: true
 *               message: "Produto encontrado com sucesso"
 *               data:
 *                 id: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
 *                 nome: "Notebook Gamer Dell G15"
 *                 descricao: "Notebook gamer com processador Intel Core i7"
 *                 valor_unitario: 5499.90
 *                 quantidade_estoque: 15
 *                 fornecedor_id: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *                 categoria: "Informática"
 *                 criado_em: "2025-01-15T10:30:00.000Z"
 *                 atualizado_em: "2025-01-15T10:30:00.000Z"
 *                 deletado_em: null
 *       400:
 *         description: Nome inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Nome deve ter no mínimo 1 caractere"
 *       404:
 *         description: Produto não encontrado com esse nome
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Produto não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto
<<<<<<< HEAD
 *     description: Cadastra um novo produto no sistema. Requer autenticação via JWT. Valida todos os campos e verifica se o nome não está duplicado.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
=======
 *     tags: [Produtos - Arthur Lumertz Guimarães]
>>>>>>> main
 *     requestBody:
 *       required: true
 *       description: Dados do produto a ser criado
 *       content:
 *         application/json:
 *           schema:
<<<<<<< HEAD
 *             $ref: '#/components/schemas/ProdutoCadastro'
 *           example:
 *             nome: "Notebook Gamer Dell G15"
 *             descricao: "Notebook gamer com processador Intel Core i7 11ª geração, 16GB RAM DDR4, SSD 512GB NVMe"
 *             valor_unitario: 5499.90
 *             quantidade_estoque: 15
 *             fornecedor_id: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *             categoria: "Informática"
=======
 *             $ref: '#/components/schemas/ProdutoInput'
>>>>>>> main
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
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
 *                   example: "Produto criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ProdutoCompleto'
 *             example:
 *               success: true
 *               message: "Produto criado com sucesso"
 *               data:
 *                 id: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
 *                 nome: "Notebook Gamer Dell G15"
 *                 descricao: "Notebook gamer com processador Intel Core i7 11ª geração"
 *                 valor_unitario: 5499.90
 *                 quantidade_estoque: 15
 *                 fornecedor_id: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *                 categoria: "Informática"
 *                 criado_em: "2025-01-15T10:30:00.000Z"
 *                 atualizado_em: "2025-01-15T10:30:00.000Z"
 *                 deletado_em: null
 *       400:
 *         description: Dados inválidos (campos obrigatórios faltando, formatos incorretos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               campos_faltando:
 *                 summary: Campos obrigatórios faltando
 *                 value:
 *                   success: false
 *                   message: "Nome é obrigatório; Valor unitário é obrigatório"
 *               valor_invalido:
 *                 summary: Valor unitário inválido
 *                 value:
 *                   success: false
 *                   message: "Valor unitário deve ser positivo"
 *               fornecedor_invalido:
 *                 summary: UUID de fornecedor inválido
 *                 value:
 *                   success: false
 *                   message: "ID do fornecedor deve ser um UUID válido"
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token não fornecido"
 *       409:
 *         description: Já existe um produto com este nome
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Já existe um produto com este nome"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /produtos/{id}:
 *   patch:
<<<<<<< HEAD
 *     summary: Atualiza parcialmente um produto existente
 *     description: Atualiza um ou mais campos de um produto. Requer autenticação via JWT. Todos os campos são opcionais, mas ao menos 1 deve ser fornecido. Campos sensíveis (id, timestamps) não podem ser alterados.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
=======
 *     summary: Atualiza um produto existente
 *     tags: [Produtos - Arthur Lumertz Guimarães]
>>>>>>> main
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do produto a ser atualizado
 *         example: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
 *     requestBody:
 *       required: true
 *       description: Campos a serem atualizados (mínimo 1 campo)
 *       content:
 *         application/json:
 *           schema:
<<<<<<< HEAD
 *             $ref: '#/components/schemas/ProdutoAtualizar'
 *           examples:
 *             atualizar_preco_estoque:
 *               summary: Atualizar apenas preço e estoque
 *               value:
 *                 valor_unitario: 5299.90
 *                 quantidade_estoque: 20
 *             atualizar_descricao:
 *               summary: Atualizar apenas descrição
 *               value:
 *                 descricao: "Notebook gamer atualizado com 32GB RAM"
=======
 *             $ref: '#/components/schemas/ProdutoInput'
>>>>>>> main
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
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
 *                   example: "Produto atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ProdutoCompleto'
 *             example:
 *               success: true
 *               message: "Produto atualizado com sucesso"
 *               data:
 *                 id: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
 *                 nome: "Notebook Gamer Dell G15"
 *                 descricao: "Notebook gamer atualizado com 32GB RAM"
 *                 valor_unitario: 5299.90
 *                 quantidade_estoque: 20
 *                 fornecedor_id: "a9383549-13f1-449a-9b0a-6c72fce4dcee"
 *                 categoria: "Informática"
 *                 criado_em: "2025-01-15T10:30:00.000Z"
 *                 atualizado_em: "2025-01-15T14:45:30.000Z"
 *                 deletado_em: null
 *       400:
 *         description: Dados inválidos ou nenhum campo fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               nenhum_campo:
 *                 summary: Nenhum campo fornecido
 *                 value:
 *                   success: false
 *                   message: "Pelo menos um campo deve ser fornecido para atualização"
 *               valor_invalido:
 *                 summary: Valor negativo
 *                 value:
 *                   success: false
 *                   message: "Valor unitário deve ser positivo"
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token não fornecido"
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Produto não encontrado"
 *       409:
 *         description: Nome duplicado (já existe outro produto com esse nome)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Já existe um produto com este nome"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
<<<<<<< HEAD
 *     summary: Remove um produto (soft delete)
 *     description: Marca um produto como deletado sem removê-lo fisicamente do banco de dados. O produto não aparecerá mais em listagens. Requer autenticação via JWT.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
=======
 *     summary: Remove um produto
 *     tags: [Produtos - Arthur Lumertz Guimarães]
>>>>>>> main
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do produto a ser deletado
 *         example: "b2738b5c-5a8a-4e8b-98c0-fc8c1e7a91d1"
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso (soft delete)
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
 *                   example: "Produto deletado com sucesso"
 *                 data:
 *                   type: null
 *                   example: null
 *             example:
 *               success: true
 *               message: "Produto deletado com sucesso"
 *               data: null
 *       400:
 *         description: ID inválido (não é um UUID válido)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "ID deve ser um UUID válido"
 *       401:
 *         description: Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token não fornecido"
 *       404:
 *         description: Produto não encontrado ou já foi deletado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Produto não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
