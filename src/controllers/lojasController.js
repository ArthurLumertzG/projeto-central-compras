const LojasService = require("../services/lojasService");
const DefaultResponseDTO = require("../dtos/defaultResponse.dto");

/**
 * @class LojasController
 * @description Controller responsável por lidar com requisições HTTP de lojas
 */
class LojasController {
  constructor() {
    this.lojasService = new LojasService();
  }

  /**
   * Retorna todas as lojas ativas
   * @route GET /lojas
   * @access Public
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Lista de lojas
   * @example
   * // Resposta de sucesso:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "id": "uuid",
   *       "nome": "Loja Matriz",
   *       "cnpj": "12345678000190",
   *       "usuario_id": "uuid",
   *       "endereco_id": "uuid",
   *       "criado_em": "2024-01-01T00:00:00.000Z",
   *       "atualizado_em": "2024-01-01T00:00:00.000Z"
   *     }
   *   ]
   * }
   */
  async getAll(req, res) {
    const lojas = await this.lojasService.getAll();
    res.status(200).json(new DefaultResponseDTO(true, "Lojas recuperadas com sucesso", lojas));
  }

  /**
   * Busca uma loja por ID
   * @route GET /lojas/:id
   * @access Public
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - UUID da loja
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Loja encontrada
   * @throws {AppError} 400 se ID inválido, 404 se não encontrada
   * @example
   * // Resposta de sucesso:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "nome": "Loja Matriz",
   *     "cnpj": "12345678000190",
   *     "usuario_id": "uuid",
   *     "endereco_id": "uuid",
   *     "criado_em": "2024-01-01T00:00:00.000Z",
   *     "atualizado_em": "2024-01-01T00:00:00.000Z"
   *   }
   * }
   */
  async getById(req, res) {
    const { id } = req.params;
    const loja = await lojasService.getById(id);
    res.status(200).json(new DefaultResponseDTO(true, "Loja recuperada com sucesso", loja));
  }

  /**
   * Busca lojas do usuário autenticado
   * @route GET /lojas/minhas/lojas
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.user.id - UUID do usuário autenticado (do middleware JWT)
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Lista de lojas do usuário
   */
  async getMinhasLojas(req, res) {
    const lojas = await this.lojasService.getByUsuarioId(req.user.id);
    res.status(200).json(new DefaultResponseDTO(true, "Lojas do usuário recuperadas com sucesso", lojas));
  }

  /**
   * Busca lojas por usuário ID
   * @route GET /lojas/usuario/:usuario_id
   * @access Public
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.usuario_id - UUID do usuário
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Lista de lojas do usuário
   */
  async getByUsuarioId(req, res) {
    const { usuario_id } = req.params;
    const lojas = await this.lojasService.getByUsuarioId(usuario_id);
    res.status(200).json(new DefaultResponseDTO(true, "Lojas do usuário recuperadas com sucesso", lojas));
  }

  /**
   * Cria uma nova loja
   * @route POST /lojas
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados da loja
   * @param {string} req.body.nome - Nome da loja (2-200 caracteres)
   * @param {string} req.body.cnpj - CNPJ da loja (14 dígitos)
   * @param {string} req.body.usuario_id - UUID do usuário responsável
   * @param {string} [req.body.endereco_id] - UUID do endereço (opcional)
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Loja criada
   * @throws {AppError} 400 se dados inválidos, 404 se usuário/endereço não existe, 409 se CNPJ duplicado
   * @example
   * // Requisição:
   * {
   *   "nome": "Loja Matriz",
   *   "cnpj": "12345678000190",
   *   "usuario_id": "uuid-do-usuario",
   *   "endereco_id": "uuid-do-endereco"
   * }
   * // Resposta de sucesso (201):
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid-gerado",
   *     "nome": "Loja Matriz",
   *     "cnpj": "12345678000190",
   *     "usuario_id": "uuid-do-usuario",
   *     "endereco_id": "uuid-do-endereco",
   *     "criado_em": "2024-01-01T00:00:00.000Z",
   *     "atualizado_em": "2024-01-01T00:00:00.000Z"
   *   },
   *   "message": "Loja criada com sucesso"
   * }
   */
  async create(req, res) {
    const loja = await this.lojasService.create(req.body);
    res.status(201).json(new DefaultResponseDTO(true, "Loja criada com sucesso", loja));
  }

  /**
   * Atualiza uma loja existente
   * @route PATCH /lojas/:id
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - UUID da loja
   * @param {Object} req.body - Dados para atualização (todos opcionais, mínimo 1 campo)
   * @param {string} [req.body.nome] - Nome da loja (2-200 caracteres)
   * @param {string} [req.body.cnpj] - CNPJ da loja (14 dígitos)
   * @param {string} [req.body.usuario_id] - UUID do usuário responsável
   * @param {string} [req.body.endereco_id] - UUID do endereço
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Loja atualizada
   * @throws {AppError} 400 se dados inválidos, 404 se loja/usuário/endereço não existe, 409 se CNPJ duplicado
   * @example
   * // Requisição:
   * {
   *   "nome": "Loja Matriz - Atualizada"
   * }
   * // Resposta de sucesso (200):
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "nome": "Loja Matriz - Atualizada",
   *     "cnpj": "12345678000190",
   *     "usuario_id": "uuid",
   *     "endereco_id": "uuid",
   *     "criado_em": "2024-01-01T00:00:00.000Z",
   *     "atualizado_em": "2024-01-01T10:00:00.000Z"
   *   },
   *   "message": "Loja atualizada com sucesso"
   * }
   */
  async update(req, res) {
    const { id } = req.params;
    const loja = await this.lojasService.update(id, req.body, req.userId);
    res.status(200).json(new DefaultResponseDTO(true, "Loja atualizada com sucesso", loja));
  }

  /**
   * Deleta uma loja (soft delete)
   * @route DELETE /lojas/:id
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - UUID da loja
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Confirmação de deleção
   * @throws {AppError} 400 se ID inválido, 404 se não encontrada
   * @example
   * // Resposta de sucesso (200):
   * {
   *   "success": true,
   *   "data": null,
   *   "message": "Loja deletada com sucesso"
   * }
   */
  async delete(req, res) {
    const { id } = req.params;
    await this.lojasService.delete(id, req.userId);
    res.status(200).json(new DefaultResponseDTO(true, null, "Loja deletada com sucesso"));
  }
}

module.exports = LojasController;
