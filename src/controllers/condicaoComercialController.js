const CondicaoComercialService = require("../services/condicaoComercialService");
const FornecedoresModel = require("../models/fornecedoresModel");
const AppError = require("../errors/AppError");

/**
 * Controller responsável por gerenciar requisições HTTP de condições comerciais
 * @class CondicaoComercialController
 */
class CondicaoComercialController {
  constructor() {
    this.condicaoComercialService = new CondicaoComercialService();
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
   * Lista todas as condições comerciais do fornecedor logado
   * @param {Object} req - Request object
   * @param {Object} req.user - Dados do usuário autenticado (fornecedor)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   *
   * @example
   * GET /condicoes-comerciais
   */
  async getAll(req, res) {
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.condicaoComercialService.getByFornecedor(fornecedor_id);
    res.status(200).json(response);
  }

  /**
   * Busca uma condição comercial por ID
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - UUID da condição comercial
   * @param {Object} req.user - Dados do usuário autenticado (fornecedor)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 404 se não encontrada, 403 se não pertence ao fornecedor
   *
   * @example
   * GET /condicoes-comerciais/:id
   */
  async getById(req, res) {
    const { id } = req.params;
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.condicaoComercialService.getById(id, fornecedor_id);
    res.status(200).json(response);
  }

  /**
   * Cria uma nova condição comercial
   * @param {Object} req - Request object
   * @param {Object} req.body - Dados da condição comercial
   * @param {string} req.body.uf - UF do estado (2 caracteres)
   * @param {number} req.body.cashback_porcentagem - Percentual de cashback (0-100)
   * @param {number} req.body.prazo_extendido_dias - Prazo extendido em dias
   * @param {number} req.body.variacao_unitario - Variação do preço unitário
   * @param {Object} req.user - Dados do usuário autenticado (fornecedor)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se validação falhar, 409 se UF já existe
   *
   * @example
   * POST /condicoes-comerciais
   */
  async create(req, res) {
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.condicaoComercialService.create(req.body, fornecedor_id);
    res.status(201).json(response);
  }

  /**
   * Atualiza uma condição comercial existente
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - UUID da condição comercial
   * @param {Object} req.body - Dados para atualizar
   * @param {Object} req.user - Dados do usuário autenticado (fornecedor)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se validação falhar, 404 se não encontrada, 403 se não pertence ao fornecedor
   *
   * @example
   * PATCH /condicoes-comerciais/:id
   */
  async update(req, res) {
    const { id } = req.params;
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.condicaoComercialService.update(id, req.body, fornecedor_id);
    res.status(200).json(response);
  }

  /**
   * Remove uma condição comercial (soft delete)
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - UUID da condição comercial
   * @param {Object} req.user - Dados do usuário autenticado (fornecedor)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 404 se não encontrada, 403 se não pertence ao fornecedor
   *
   * @example
   * DELETE /condicoes-comerciais/:id
   */
  async delete(req, res) {
    const { id } = req.params;
    const fornecedor_id = await this.getFornecedorIdByUsuarioId(req.user.id);
    const response = await this.condicaoComercialService.delete(id, fornecedor_id);
    res.status(200).json(response);
  }
}

module.exports = new CondicaoComercialController();
