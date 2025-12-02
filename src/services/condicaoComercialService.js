const CondicaoComercialModel = require("../models/condicaoComercialModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { v4: uuidv4 } = require("uuid");
const { createCondicaoComercialSchema, updateCondicaoComercialSchema } = require("../validations/condicaoComercialValidation");

/**
 * Service responsável pelas regras de negócio de condições comerciais
 * @class CondicaoComercialService
 */
class CondicaoComercialService {
  constructor() {
    this.condicaoComercialModel = new CondicaoComercialModel();
  }

  /**
   * Busca todas as condições comerciais de um fornecedor
   * @param {string} fornecedor_id - UUID do fornecedor
   * @returns {Promise<DefaultResponseDto>} Lista de condições comerciais
   */
  async getByFornecedor(fornecedor_id) {
    const condicoes = await this.condicaoComercialModel.selectByFornecedor(fornecedor_id);
    if (!condicoes || condicoes.length === 0) {
      return new DefaultResponseDto(true, "Nenhuma condição comercial encontrada", []);
    }

    return new DefaultResponseDto(true, "Condições comerciais encontradas com sucesso", condicoes);
  }

  /**
   * Busca uma condição comercial por ID
   * @param {string} id - UUID da condição comercial
   * @param {string} fornecedor_id - UUID do fornecedor (para validação de propriedade)
   * @returns {Promise<DefaultResponseDto>} Condição comercial encontrada
   * @throws {AppError} 404 se não encontrada, 403 se não pertence ao fornecedor
   */
  async getById(id, fornecedor_id) {
    const condicao = await this.condicaoComercialModel.selectById(id);
    if (!condicao) {
      throw new AppError("Condição comercial não encontrada", 404);
    }

    // Verifica se a condição pertence ao fornecedor
    if (condicao.fornecedor_id !== fornecedor_id) {
      throw new AppError("Você não tem permissão para acessar esta condição comercial", 403);
    }

    return new DefaultResponseDto(true, "Condição comercial encontrada com sucesso", condicao);
  }

  /**
   * Cria uma nova condição comercial
   * @param {Object} data - Dados da condição comercial
   * @param {string} fornecedor_id - UUID do fornecedor
   * @returns {Promise<DefaultResponseDto>} Condição comercial criada
   * @throws {AppError} 400 se validação falhar, 409 se UF já existe para o fornecedor
   */
  async create(data, fornecedor_id) {
    // 1. Validação com Joi
    const { error, value } = createCondicaoComercialSchema.validate(data, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Verifica se já existe condição para esta UF e fornecedor
    const condicaoExists = await this.condicaoComercialModel.selectByUfAndFornecedor(value.uf, fornecedor_id);
    if (condicaoExists) {
      throw new AppError("Já existe uma condição comercial para este estado", 409);
    }

    // 3. Gera UUID e adiciona fornecedor_id
    const newCondicao = {
      id: uuidv4(),
      ...value,
      fornecedor_id,
      criado_em: new Date(),
      atualizado_em: new Date(),
    };

    // 4. Cria no banco
    const condicaoCriada = await this.condicaoComercialModel.create(newCondicao);

    return new DefaultResponseDto(true, "Condição comercial criada com sucesso", condicaoCriada);
  }

  /**
   * Atualiza uma condição comercial existente
   * @param {string} id - UUID da condição comercial
   * @param {Object} data - Dados para atualizar
   * @param {string} fornecedor_id - UUID do fornecedor (para validação de propriedade)
   * @returns {Promise<DefaultResponseDto>} Condição comercial atualizada
   * @throws {AppError} 400 se validação falhar, 404 se não encontrada, 403 se não pertence ao fornecedor
   */
  async update(id, data, fornecedor_id) {
    // 1. Validação com Joi
    const { error, value } = updateCondicaoComercialSchema.validate(data, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Verifica se a condição existe
    const condicaoExistente = await this.condicaoComercialModel.selectById(id);
    if (!condicaoExistente) {
      throw new AppError("Condição comercial não encontrada", 404);
    }

    // 3. Verifica se a condição pertence ao fornecedor
    if (condicaoExistente.fornecedor_id !== fornecedor_id) {
      throw new AppError("Você não tem permissão para atualizar esta condição comercial", 403);
    }

    // 4. Atualiza no banco
    const condicaoAtualizada = await this.condicaoComercialModel.update(id, value);
    if (!condicaoAtualizada) {
      throw new AppError("Erro ao atualizar condição comercial", 500);
    }

    return new DefaultResponseDto(true, "Condição comercial atualizada com sucesso", condicaoAtualizada);
  }

  /**
   * Remove uma condição comercial (soft delete)
   * @param {string} id - UUID da condição comercial
   * @param {string} fornecedor_id - UUID do fornecedor (para validação de propriedade)
   * @returns {Promise<DefaultResponseDto>} Confirmação da remoção
   * @throws {AppError} 404 se não encontrada, 403 se não pertence ao fornecedor
   */
  async delete(id, fornecedor_id) {
    // 1. Verifica se a condição existe
    const condicaoExistente = await this.condicaoComercialModel.selectById(id);
    if (!condicaoExistente) {
      throw new AppError("Condição comercial não encontrada", 404);
    }

    // 2. Verifica se a condição pertence ao fornecedor
    if (condicaoExistente.fornecedor_id !== fornecedor_id) {
      throw new AppError("Você não tem permissão para deletar esta condição comercial", 403);
    }

    // 3. Realiza soft delete
    const condicaoDeletada = await this.condicaoComercialModel.softDelete(id);
    if (!condicaoDeletada) {
      throw new AppError("Erro ao deletar condição comercial", 500);
    }

    return new DefaultResponseDto(true, "Condição comercial deletada com sucesso", null);
  }
}

module.exports = CondicaoComercialService;
