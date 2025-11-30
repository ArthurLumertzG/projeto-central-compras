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
   * Busca uma campanha por ID
   * @param {string} id - UUID da campanha
   * @returns {Promise<DefaultResponseDto>} Campanha encontrada
   * @throws {AppError} 400 se ID inválido, 404 se não encontrada
   */
  async getById(id) {
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

    return new DefaultResponseDto(true, "Campanha encontrada com sucesso", campanha);
  }

<<<<<<< HEAD
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
   * @returns {Promise<DefaultResponseDto>} Campanha criada
   * @throws {AppError} 400 se validação falhar, 409 se nome já existe
   */
  async create(data) {
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
=======
  async create(campanha) {
    const newId = uuidv4();
>>>>>>> main
    const newCampanha = {
      id: uuidv4(),
      ...value,
      status: value.status || "ativa",
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
   * @returns {Promise<DefaultResponseDto>} Campanha atualizada
   * @throws {AppError} 400 se validação falhar, 404 se não encontrada, 409 se nome duplicado
   */
  async update(id, data) {
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

    // 3. Validação com Joi
    const { error, value } = updateCampanhaSchema.validate(data, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 4. Verifica unicidade do nome (se está sendo alterado)
    if (value.nome && value.nome !== campanhaExists.nome) {
      const nomeExists = await this.campanhasModel.selectByNome(value.nome);
      if (nomeExists) {
        throw new AppError("Já existe uma campanha com este nome", 409);
      }
    }

    // 5. Adiciona timestamp de atualização
    const updateData = {
      ...value,
      atualizado_em: new Date(),
    };

    // 6. Atualiza no banco
    const updatedCampanha = await this.campanhasModel.update(id, updateData);

    return new DefaultResponseDto(true, "Campanha atualizada com sucesso", updatedCampanha);
  }

  /**
   * Deleta uma campanha (soft delete)
   * @param {string} id - UUID da campanha
   * @returns {Promise<DefaultResponseDto>} Confirmação de deleção
   * @throws {AppError} 400 se ID inválido, 404 se não encontrada
   */
  async delete(id) {
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

    // 3. Deleta (soft delete)
    await this.campanhasModel.delete(id);

    return new DefaultResponseDto(true, "Campanha deletada com sucesso", null);
  }
}

module.exports = CampanhasService;
