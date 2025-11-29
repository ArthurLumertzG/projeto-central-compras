const PedidosService = require("../services/pedidosService");

/**
 * Controller responsável por gerenciar requisições HTTP de pedidos
 * @class PedidosController
 */
class PedidosController {
  constructor() {
    this.pedidosService = new PedidosService();
  }

  /**
   * Lista todos os pedidos
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   *
   * @example
   * GET /pedidos
   */
  async getAll(req, res) {
    const response = await this.pedidosService.getAll();
    res.status(200).json(response);
  }

  /**
   * Busca um pedido por ID (com seus itens)
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - UUID do pedido
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se ID inválido, 404 se não encontrado
   *
   * @example
   * GET /pedidos/:id
   */
  async getById(req, res) {
    const { id } = req.params;
    const response = await this.pedidosService.getById(id);
    res.status(200).json(response);
  }

  /**
   * Busca pedidos por status
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.status - Status do pedido (pendente, enviado, entregue, cancelado)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se status inválido
   *
   * @example
   * GET /pedidos/status/:status
   */
  async getByStatus(req, res) {
    const { status } = req.params;
    const response = await this.pedidosService.getByStatus(status);
    res.status(200).json(response);
  }

  /**
   * Busca pedidos do usuário autenticado
   * @param {Object} req - Request object
   * @param {string} req.user.id - ID do usuário autenticado (JWT middleware)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   *
   * @example
   * GET /pedidos/meus/pedidos
   */
  async getMeusPedidos(req, res) {
    const response = await this.pedidosService.getByUsuarioId(req.user.id);
    res.status(200).json(response);
  }

  /**
   * Busca pedidos por data
   * @param {Object} req - Request object
   * @param {Object} req.query - Query parameters
   * @param {string} req.query.date - Data no formato YYYY-MM-DD
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se data inválida
   *
   * @example
   * GET /pedidos/search/date?date=2024-10-18
   */
  async getByDate(req, res) {
    const { date } = req.query;
    const response = await this.pedidosService.getByDate(date);
    res.status(200).json(response);
  }

  /**
   * Cria um novo pedido com seus produtos (transação atômica)
   * @param {Object} req - Request object
   * @param {string} req.user.id - ID do usuário autenticado (JWT middleware)
   * @param {Object} req.body - Dados do pedido
   * @param {string} [req.body.descricao] - Descrição/observações (5-500 caracteres)
   * @param {string} req.body.forma_pagamento - Forma de pagamento
   * @param {number} req.body.prazo_dias - Prazo de entrega em dias (1-365)
   * @param {Array} req.body.produtos - Array de produtos [{produto_id, quantidade, valor_unitario}]
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se validação falhar, 404 se FK inválida, 409 se estoque insuficiente
   *
   * @example
   * POST /pedidos
   * Body: { forma_pagamento: "pix", prazo_dias: 7, produtos: [...] }
   * O usuario_id do token JWT será usado como loja_id automaticamente
   */
  async create(req, res) {
    const response = await this.pedidosService.create(req.body, req.user.id);
    res.status(201).json(response);
  }

  /**
   * Atualiza um pedido existente
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - UUID do pedido
   * @param {string} req.userId - ID do usuário autenticado (JWT middleware)
   * @param {Object} req.body - Dados para atualizar
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se validação falhar, 403 se não tem permissão, 404 se não encontrado, 409 se pedido não pode ser editado
   *
   * @example
   * PATCH /pedidos/:id
   */
  async update(req, res) {
    const { id } = req.params;
    const response = await this.pedidosService.update(id, req.body, req.userId);
    res.status(200).json(response);
  }

  /**
   * Deleta um pedido (soft delete)
   * @param {Object} req - Request object
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - UUID do pedido
   * @param {string} req.userId - ID do usuário autenticado (JWT middleware)
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   * @throws {AppError} 400 se ID inválido, 403 se não tem permissão, 404 se não encontrado, 409 se pedido não pode ser deletado
   *
   * @example
   * DELETE /pedidos/:id
   */
  async delete(req, res) {
    const { id } = req.params;
    const response = await this.pedidosService.delete(id, req.userId);
    res.status(200).json(response);
  }
}

module.exports = new PedidosController();
