const CampanhasService = require("../services/campanhaService");
const FornecedoresModel = require("../models/fornecedoresModel");
const AppError = require("../errors/AppError");

/**
 * Controller responsável por gerenciar requisições HTTP de campanhas promocionais
 * @class CampanhasController
 */
class CampanhasController {
  constructor() {
    this.campanhasService = new CampanhasService();
    this.fornecedoresModel = new FornecedoresModel();
  }

  /**
   * Busca o fornecedor_id pelo usuario_id do token
   * @param {string} usuario_id - ID do usuário autenticado
   * @returns {Promise<string>} ID do fornecedor
   * @throws {AppError} 404 se fornecedor não encontrado
   */
  async getFornecedorIdByUsuarioId(usuario_id) {
    const fornecedor = await this.fornecedoresModel.selectByUsuarioId(usuario_id);
    if (!fornecedor[0]) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    return fornecedor[0].id;
  }

  /**
   * Lista todas as campanhas
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   *
   * @example
   * GET /campanhas
   */
  async getAll(req, res) {
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.campanhasService.getByFornecedor(fornecedor_id);
    res.status(200).json(response);
  }

  /**
   * Busca uma campanha por ID
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - UUID da campanha
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se ID inválido, 404 se não encontrada
   *
   * @example
   * GET /campanhas/:id
   */
  async getById(req, res) {
    const { id } = req.params;
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.campanhasService.getById(id, fornecedor_id);
    res.status(200).json(response);
  }

  /**
   * Busca campanhas por status
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.status - Status da campanha (ativa, inativa, expirada)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se status inválido
   *
   * @example
   * GET /campanhas/status/:status
   */
  async getByStatus(req, res) {
    const { status } = req.params;
    const response = await this.campanhasService.getByStatus(status);
    res.status(200).json(response);
  }

  /**
   * Cria uma nova campanha
   * @param {Object} req - Request object
   * @param {Object} req.body - Dados da campanha
   * @param {string} req.body.nome - Nome da campanha (3-100 caracteres)
   * @param {string} [req.body.descricao] - Descrição da campanha (10-500 caracteres)
   * @param {number} [req.body.valor_min] - Valor mínimo para aplicar desconto
   * @param {number} [req.body.quantidade_min] - Quantidade mínima para aplicar desconto
   * @param {number} req.body.desconto_porcentagem - Percentual de desconto (0-100)
   * @param {string} [req.body.status] - Status da campanha (ativa, inativa, expirada)
   * @param {Object} req.user - Dados do usuário autenticado (fornecedor)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se validação falhar, 409 se nome já existe
   *
   * @example
   * POST /campanhas
   */
  async create(req, res) {
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.campanhasService.create(req.body, fornecedor_id);
    res.status(201).json(response);
  }

  /**
   * Atualiza uma campanha existente
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - UUID da campanha
   * @param {Object} req.body - Dados para atualizar
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se validação falhar, 404 se não encontrada, 409 se nome duplicado
   *
   * @example
   * PATCH /campanhas/:id
   */
  async update(req, res) {
    const { id } = req.params;
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.campanhasService.update(id, req.body, fornecedor_id);
    res.status(200).json(response);
  }

  /**
   * Deleta uma campanha (soft delete)
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - UUID da campanha
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se ID inválido, 404 se não encontrada
   *
   * @example
   * DELETE /campanhas/:id
   */
  async delete(req, res) {
    const { id } = req.params;
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.campanhasService.delete(id, fornecedor_id);
    res.status(200).json(response);
  }
}

module.exports = new CampanhasController();
