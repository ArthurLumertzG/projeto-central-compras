const ProdutosService = require("../services/produtosService");
const produtosService = new ProdutosService();

/**
 * @class ProdutosController
 * @description Controller responsável por gerenciar requisições HTTP relacionadas a produtos
 * Atua como camada intermediária entre as rotas e o service
 */
class ProdutosController {
  /**
   * Lista todos os produtos ativos
   *
   * @route GET /produtos
   * @access Public
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com lista de produtos
   */
  async getAll(req, res) {
    const response = await produtosService.getAll();
    res.status(200).json(response);
  }

  /**
   * Busca um produto por ID
   *
   * @route GET /produtos/id/:id
   * @access Public
   * @param {Object} req - Express request object
   * @param {string} req.params.id - UUID do produto
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com dados do produto, 404 se não encontrado
   */
  async getById(req, res) {
    const { id } = req.params;
    const response = await produtosService.getById(id);
    res.status(200).json(response);
  }

  /**
   * Busca um produto por nome
   *
   * @route GET /produtos/nome/:nome
   * @access Public
   * @param {Object} req - Express request object
   * @param {string} req.params.nome - Nome do produto
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com dados do produto, 404 se não encontrado
   */
  async getByName(req, res) {
    const { nome } = req.params;
    const response = await produtosService.getByName(nome);
    res.status(200).json(response);
  }

  /**
   * Cria um novo produto
   *
   * @route POST /produtos
   * @access Private (requer autenticação)
   * @param {Object} req - Express request object
   * @param {Object} req.body - Dados do produto
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 201 com produto criado, 400 se dados inválidos, 409 se duplicado
   */
  async create(req, res) {
    const produto = req.body;
    const response = await produtosService.create(produto);
    res.status(201).json(response);
  }

  /**
   * Atualiza um produto existente
   *
   * @route PATCH /produtos/:id
   * @access Private (requer autenticação)
   * @param {Object} req - Express request object
   * @param {string} req.params.id - UUID do produto
   * @param {Object} req.body - Dados para atualização
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com produto atualizado, 404 se não encontrado, 409 se nome duplicado
   */
  async update(req, res) {
    const { id } = req.params;
    const produto = req.body;
    const response = await produtosService.update(id, produto);
    res.status(200).json(response);
  }

  /**
   * Deleta um produto (soft delete)
   *
   * @route DELETE /produtos/:id
   * @access Private (requer autenticação)
   * @param {Object} req - Express request object
   * @param {string} req.params.id - UUID do produto
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com confirmação, 404 se não encontrado
   */
  async delete(req, res) {
    const { id } = req.params;
    const response = await produtosService.delete(id);
    res.status(200).json(response);
  }
}

module.exports = new ProdutosController();
