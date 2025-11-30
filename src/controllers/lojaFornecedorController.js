const LojaFornecedorService = require("../services/lojaFornecedorService");

/**
 * Controller responsável por gerenciar requisições HTTP de vínculos loja-fornecedor
 * @class LojaFornecedorController
 */
class LojaFornecedorController {
  constructor() {
    this.lojaFornecedorService = new LojaFornecedorService();
  }

  /**
   * Lista todos os vínculos loja-fornecedor
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   *
   * @example
   * GET /loja-fornecedor
   */
  async getAll(req, res) {
    const response = await this.lojaFornecedorService.getAll();
    res.status(200).json(response);
  }

  /**
   * Busca todos os fornecedores de uma loja
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.loja_id - UUID da loja
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se ID inválido, 404 se loja não encontrada
   *
   * @example
   * GET /loja-fornecedor/loja/:loja_id
   */
  async getFornecedoresByLojaId(req, res) {
    const { loja_id } = req.params;
    const response = await this.lojaFornecedorService.getFornecedoresByLojaId(loja_id);
    res.status(200).json(response);
  }

  /**
   * Busca todas as lojas atendidas por um fornecedor
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.fornecedor_id - UUID do fornecedor
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se ID inválido, 404 se fornecedor não encontrado
   *
   * @example
   * GET /loja-fornecedor/fornecedor/:fornecedor_id
   */
  async getLojasByFornecedorId(req, res) {
    const { fornecedor_id } = req.params;
    const response = await this.lojaFornecedorService.getLojasByFornecedorId(fornecedor_id);
    res.status(200).json(response);
  }

  /**
   * Cria um novo vínculo loja-fornecedor
   * @param {Object} req - Request object
   * @param {string} req.userId - ID do usuário autenticado (JWT middleware)
   * @param {Object} req.body - Dados do vínculo
   * @param {string} req.body.loja_id - UUID da loja
   * @param {string} req.body.fornecedor_id - UUID do fornecedor
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se validação falhar, 403 se não tem permissão, 404 se FK inválida, 409 se vínculo já existe
   *
   * @example
   * POST /loja-fornecedor
   */
  async create(req, res) {
    const response = await this.lojaFornecedorService.create(req.body, req.userId);
    res.status(201).json(response);
  }

  /**
   * Deleta um vínculo loja-fornecedor (soft delete)
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.loja_id - UUID da loja
   * @param {string} req.params.fornecedor_id - UUID do fornecedor
   * @param {string} req.userId - ID do usuário autenticado (JWT middleware)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se ID inválido, 403 se não tem permissão, 404 se vínculo não encontrado
   *
   * @example
   * DELETE /loja-fornecedor/:loja_id/:fornecedor_id
   */
  async delete(req, res) {
    const { loja_id, fornecedor_id } = req.params;
    const response = await this.lojaFornecedorService.delete(loja_id, fornecedor_id, req.userId);
    res.status(200).json(response);
  }
}

module.exports = new LojaFornecedorController();
