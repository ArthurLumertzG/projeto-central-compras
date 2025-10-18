const FornecedoresService = require("../services/fornecedoresService");
const DefaultResponseDTO = require("../dtos/defaultResponse.dto");

/**
 * @class FornecedoresController
 * @description Controller responsável por lidar com requisições HTTP de fornecedores
 */
class FornecedoresController {
  constructor() {
    this.fornecedoresService = new FornecedoresService();
  }

  /**
   * Retorna todos os fornecedores ativos
   * @route GET /fornecedores
   * @access Public
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Lista de fornecedores
   */
  async getAll(req, res) {
    const fornecedores = await this.fornecedoresService.getAll();
    res.status(200).json(new DefaultResponseDTO(true, fornecedores, "Fornecedores recuperados com sucesso"));
  }

  /**
   * Busca um fornecedor por ID
   * @route GET /fornecedores/:id
   * @access Public
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - UUID do fornecedor
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Fornecedor encontrado
   * @throws {AppError} 400 se ID inválido, 404 se não encontrado
   */
  async getById(req, res) {
    const { id } = req.params;
    const fornecedor = await this.fornecedoresService.getById(id);
    res.status(200).json(new DefaultResponseDTO(true, fornecedor, "Fornecedor recuperado com sucesso"));
  }

  /**
   * Busca um fornecedor por CNPJ
   * @route GET /fornecedores/cnpj/:cnpj
   * @access Public
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.cnpj - CNPJ do fornecedor (14 dígitos)
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Fornecedor encontrado
   * @throws {AppError} 400 se CNPJ inválido, 404 se não encontrado
   */
  async getByCnpj(req, res) {
    const { cnpj } = req.params;
    const fornecedor = await this.fornecedoresService.getByCnpj(cnpj);
    res.status(200).json(new DefaultResponseDTO(true, fornecedor, "Fornecedor recuperado com sucesso"));
  }

  /**
   * Cria um novo fornecedor
   * @route POST /fornecedores
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do fornecedor
   * @param {string} req.body.cnpj - CNPJ do fornecedor (14 dígitos)
   * @param {string} req.body.descricao - Descrição do fornecedor (2-500 caracteres)
   * @param {string} req.body.usuario_id - UUID do usuário responsável
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Fornecedor criado
   * @throws {AppError} 400 se dados inválidos, 404 se usuário não existe, 409 se CNPJ duplicado
   */
  async create(req, res) {
    const fornecedor = await this.fornecedoresService.create(req.body);
    res.status(201).json(new DefaultResponseDTO(true, fornecedor, "Fornecedor criado com sucesso"));
  }

  /**
   * Atualiza um fornecedor existente
   * @route PATCH /fornecedores/:id
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - UUID do fornecedor
   * @param {string} req.userId - UUID do usuário autenticado (do middleware)
   * @param {Object} req.body - Dados para atualização (todos opcionais, mínimo 1 campo)
   * @param {string} [req.body.cnpj] - CNPJ do fornecedor (14 dígitos)
   * @param {string} [req.body.descricao] - Descrição do fornecedor (2-500 caracteres)
   * @param {string} [req.body.usuario_id] - UUID do usuário responsável
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Fornecedor atualizado
   * @throws {AppError} 400 se dados inválidos, 403 se tentar atualizar fornecedor de outro usuário, 404 se fornecedor/usuário não existe, 409 se CNPJ duplicado
   */
  async update(req, res) {
    const { id } = req.params;
    const fornecedor = await this.fornecedoresService.update(id, req.body, req.userId);
    res.status(200).json(new DefaultResponseDTO(true, fornecedor, "Fornecedor atualizado com sucesso"));
  }

  /**
   * Deleta um fornecedor (soft delete)
   * @route DELETE /fornecedores/:id
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - UUID do fornecedor
   * @param {string} req.userId - UUID do usuário autenticado (do middleware)
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Confirmação de deleção
   * @throws {AppError} 400 se ID inválido, 403 se tentar deletar fornecedor de outro usuário, 404 se não encontrado
   */
  async delete(req, res) {
    const { id } = req.params;
    await this.fornecedoresService.delete(id, req.userId);
    res.status(200).json(new DefaultResponseDTO(true, null, "Fornecedor deletado com sucesso"));
  }
}

module.exports = FornecedoresController;
