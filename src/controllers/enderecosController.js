const EnderecosService = require("../services/enderecosService");
const enderecosService = new EnderecosService();

/**
 * @class EnderecosController
 * @description Controller responsável por gerenciar requisições HTTP relacionadas a endereços
 * Atua como camada intermediária entre as rotas e o service
 */
class EnderecosController {
  /**
   * Lista todos os endereços ativos
   *
   * @route GET /enderecos
   * @access Public
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com lista de endereços
   */
  async getAll(req, res) {
    const response = await enderecosService.getAll();
    res.status(200).json(response);
  }

  /**
   * Busca um endereço por ID
   *
   * @route GET /enderecos/:id
   * @access Public
   * @param {Object} req - Express request object
   * @param {string} req.params.id - UUID do endereço
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com dados do endereço, 404 se não encontrado
   */
  async getById(req, res) {
    const { id } = req.params;
    const response = await enderecosService.getById(id);
    res.status(200).json(response);
  }

  /**
   * Busca endereços por CEP
   *
   * @route GET /enderecos/cep/:cep
   * @access Public
   * @param {Object} req - Express request object
   * @param {string} req.params.cep - CEP (com ou sem hífen)
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com lista de endereços
   */
  async getByCep(req, res) {
    const { cep } = req.params;
    const response = await enderecosService.getByCep(cep);
    res.status(200).json(response);
  }

  /**
   * Busca endereços por cidade e estado
   *
   * @route GET /enderecos/cidade/:cidade/estado/:estado
   * @access Public
   * @param {Object} req - Express request object
   * @param {string} req.params.cidade - Nome da cidade
   * @param {string} req.params.estado - Sigla do estado
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com lista de endereços
   */
  async getByCidadeEstado(req, res) {
    const { cidade, estado } = req.params;
    const response = await enderecosService.getByCidadeEstado(cidade, estado);
    res.status(200).json(response);
  }

  /**
   * Cria um novo endereço
   *
   * @route POST /enderecos
   * @access Public (necessário para cadastro de usuários)
   * @param {Object} req - Express request object
   * @param {Object} req.body - Dados do endereço
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 201 com endereço criado, 400 se dados inválidos
   */
  async create(req, res) {
    const endereco = req.body;
    const response = await enderecosService.create(endereco);
    res.status(201).json(response);
  }

  /**
   * Atualiza um endereço existente
   *
   * @route PATCH /enderecos/:id
   * @access Private (requer autenticação)
   * @param {Object} req - Express request object
   * @param {string} req.params.id - UUID do endereço
   * @param {Object} req.body - Dados para atualização
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com endereço atualizado, 404 se não encontrado
   */
  async update(req, res) {
    const { id } = req.params;
    const endereco = req.body;
    const response = await enderecosService.update(id, endereco);
    res.status(200).json(response);
  }

  /**
   * Deleta um endereço (soft delete)
   *
   * @route DELETE /enderecos/:id
   * @access Private (requer autenticação)
   * @param {Object} req - Express request object
   * @param {string} req.params.id - UUID do endereço
   * @param {Object} res - Express response object
   * @returns {Promise<void>} 200 com confirmação, 404 se não encontrado
   */
  async delete(req, res) {
    const { id } = req.params;
    const response = await enderecosService.delete(id);
    res.status(200).json(response);
  }
}

module.exports = new EnderecosController();
