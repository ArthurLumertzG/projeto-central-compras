const CampanhasModel = require("../models/campanhaModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { v4: uuidv4 } = require("uuid");
const { createCampanhaSchema, updateCampanhaSchema, uuidSchema, statusSchema } = require("../validations/campanhaValidation");

/**
 * Service responsável pelas regras de negócio de campanhas promocionais
 * @class CampanhasService
 */
class CampanhasService {
  constructor() {
    this.campanhasModel = new CampanhasModel();
  }

  /**
   * Busca todas as campanhas
   * @returns {Promise<DefaultResponseDto>} Lista de campanhas
   */
  async getAll() {
    const campanhas = await this.campanhasModel.select();
    if (!campanhas || campanhas.length === 0) {
      return new DefaultResponseDto(true, "Nenhuma campanha encontrada", []);
    }

    return new DefaultResponseDto(true, "Campanhas encontradas com sucesso", campanhas);
  }

  /**
   * Busca todas as campanhas de um fornecedor específico
   * @param {string} fornecedor_id - UUID do fornecedor
   * @returns {Promise<DefaultResponseDto>} Lista de campanhas do fornecedor
   */
  async getByFornecedor(fornecedor_id) {
    const campanhas = await this.campanhasModel.selectByFornecedor(fornecedor_id);
    if (!campanhas || campanhas.length === 0) {
      return new DefaultResponseDto(true, "Nenhuma campanha encontrada", []);
    }

    return new DefaultResponseDto(true, "Campanhas encontradas com sucesso", campanhas);
  }

  /**
   * Busca uma campanha por ID
   * @param {string} id - UUID da campanha
   * @param {string} fornecedor_id - UUID do fornecedor (para validar propriedade)
   * @returns {Promise<DefaultResponseDto>} Campanha encontrada
   * @throws {AppError} 400 se ID inválido, 404 se não encontrada, 403 se não pertence ao fornecedor
   */
  async getById(id, fornecedor_id) {
    // 1. Valida UUID
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Busca campanha
    const campanha = await this.campanhasModel.selectById(id);
    if (!campanha) {
      throw new AppError("Campanha não encontrada", 404);
    }

    // 3. Valida se a campanha pertence ao fornecedor
    if (campanha.fornecedor_id !== fornecedor_id) {
      throw new AppError("Você não tem permissão para acessar esta campanha", 403);
    }

    return new DefaultResponseDto(true, "Campanha encontrada com sucesso", campanha);
  }

  /**
   * Busca campanhas por status
   * @param {string} status - Status da campanha (ativa, inativa, expirada)
   * @returns {Promise<DefaultResponseDto>} Lista de campanhas
   * @throws {AppError} 400 se status inválido
   */
  async getByStatus(status) {
    // 1. Valida status
    const { error } = statusSchema.validate(status);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Busca campanhas
    const campanhas = await this.campanhasModel.selectByStatus(status);
    if (!campanhas || campanhas.length === 0) {
      return new DefaultResponseDto(true, `Nenhuma campanha encontrada com status '${status}'`, []);
    }

    return new DefaultResponseDto(true, "Campanhas encontradas com sucesso", campanhas);
  }

  /**
   * Cria uma nova campanha
   * @param {Object} data - Dados da campanha
   * @param {string} fornecedor_id - UUID do fornecedor
   * @returns {Promise<DefaultResponseDto>} Campanha criada
   * @throws {AppError} 400 se validação falhar, 409 se nome já existe
   */
  async create(data, fornecedor_id) {
    // 1. Validação com Joi
    const { error, value } = createCampanhaSchema.validate(data, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Verifica se o nome já existe
    const campanhaExists = await this.campanhasModel.selectByNome(value.nome);
    if (campanhaExists) {
      throw new AppError("Já existe uma campanha com este nome", 409);
    }

    // 3. Gera UUID e timestamps
    const newCampanha = {
      id: uuidv4(),
      ...value,
      status: value.status || "ativo",
      fornecedor_id,
      criado_em: new Date(),
      atualizado_em: new Date(),
    };

    // 4. Cria no banco
    const createdCampanha = await this.campanhasModel.create(newCampanha);

    return new DefaultResponseDto(true, "Campanha criada com sucesso", createdCampanha);
  }

  /**
   * Atualiza uma campanha existente
   * @param {string} id - UUID da campanha
   * @param {Object} data - Dados para atualizar
   * @param {string} fornecedor_id - UUID do fornecedor (para validar propriedade)
   * @returns {Promise<DefaultResponseDto>} Campanha atualizada
   * @throws {AppError} 400 se validação falhar, 404 se não encontrada, 403 se não pertence ao fornecedor, 409 se nome duplicado
   */
  async update(id, data, fornecedor_id) {
    // 1. Valida UUID
    const { error: uuidError } = uuidSchema.validate(id);
    if (uuidError) {
      throw new AppError(uuidError.details[0].message, 400);
    }

    // 2. Verifica se campanha existe
    const campanhaExists = await this.campanhasModel.selectById(id);
    if (!campanhaExists) {
      throw new AppError("Campanha não encontrada", 404);
    }

    // 3. Valida se a campanha pertence ao fornecedor
    if (campanhaExists.fornecedor_id !== fornecedor_id) {
      throw new AppError("Você não tem permissão para atualizar esta campanha", 403);
    }

    // 4. Validação com Joi
    const { error, value } = updateCampanhaSchema.validate(data, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 5. Verifica unicidade do nome (se está sendo alterado)
    if (value.nome && value.nome !== campanhaExists.nome) {
      const nomeExists = await this.campanhasModel.selectByNome(value.nome);
      if (nomeExists) {
        throw new AppError("Já existe uma campanha com este nome", 409);
      }
    }

    // 6. Adiciona timestamp de atualização
    const updateData = {
      ...value,
      atualizado_em: new Date(),
    };

    // 7. Atualiza no banco
    const updatedCampanha = await this.campanhasModel.update(id, updateData);

    return new DefaultResponseDto(true, "Campanha atualizada com sucesso", updatedCampanha);
  }

  /**
   * Deleta uma campanha (soft delete)
   * @param {string} id - UUID da campanha
   * @param {string} fornecedor_id - UUID do fornecedor (para validar propriedade)
   * @returns {Promise<DefaultResponseDto>} Confirmação de deleção
   * @throws {AppError} 400 se ID inválido, 404 se não encontrada, 403 se não pertence ao fornecedor
   */
  async delete(id, fornecedor_id) {
    // 1. Valida UUID
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Verifica se campanha existe
    const campanhaExists = await this.campanhasModel.selectById(id);
    if (!campanhaExists) {
      throw new AppError("Campanha não encontrada", 404);
    }

    // 3. Valida se a campanha pertence ao fornecedor
    if (campanhaExists.fornecedor_id !== fornecedor_id) {
      throw new AppError("Você não tem permissão para deletar esta campanha", 403);
    }

    // 4. Deleta (soft delete)
    await this.campanhasModel.delete(id);

    return new DefaultResponseDto(true, "Campanha deletada com sucesso", null);
  }
}

module.exports = CampanhasService;
