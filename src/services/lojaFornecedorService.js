const LojaFornecedorModel = require("../models/lojaFornecedorModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const database = require("../../db/database");
const { createLojaFornecedorSchema, uuidSchema } = require("../validations/lojaFornecedorValidation");

/**
 * Service responsável pelas regras de negócio de vínculos loja-fornecedor
 * Gerencia a relação N:N entre lojas e fornecedores
 * @class LojaFornecedorService
 */
class LojaFornecedorService {
  constructor() {
    this.lojaFornecedorModel = new LojaFornecedorModel();
  }

  /**
   * Busca todos os vínculos loja-fornecedor
   * @returns {Promise<DefaultResponseDto>} Lista de vínculos
   */
  async getAll() {
    const vinculos = await this.lojaFornecedorModel.select();

    if (!vinculos || vinculos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum vínculo encontrado", []);
    }

    return new DefaultResponseDto(true, "Vínculos encontrados com sucesso", vinculos);
  }

  /**
   * Busca todos os fornecedores de uma loja
   * @param {string} loja_id - UUID da loja
   * @returns {Promise<DefaultResponseDto>} Lista de fornecedores da loja
   * @throws {AppError} 400 se ID inválido, 404 se loja não encontrada
   */
  async getFornecedoresByLojaId(loja_id) {
    // 1. Valida UUID
    const { error } = uuidSchema.validate(loja_id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Verifica se loja existe
    const lojaQuery = await database.query({
      text: "SELECT id FROM lojas WHERE id = $1 AND deletado_em IS NULL",
      values: [loja_id],
    });

    if (lojaQuery.rows.length === 0) {
      throw new AppError("Loja não encontrada", 404);
    }

    // 3. Busca fornecedores
    const fornecedores = await this.lojaFornecedorModel.selectFornecedoresByLojaId(loja_id);

    if (!fornecedores || fornecedores.length === 0) {
      return new DefaultResponseDto(true, "Nenhum fornecedor vinculado a esta loja", []);
    }

    return new DefaultResponseDto(true, "Fornecedores encontrados com sucesso", fornecedores);
  }

  /**
   * Busca todas as lojas atendidas por um fornecedor
   * @param {string} fornecedor_id - UUID do fornecedor
   * @returns {Promise<DefaultResponseDto>} Lista de lojas do fornecedor
   * @throws {AppError} 400 se ID inválido, 404 se fornecedor não encontrado
   */
  async getLojasByFornecedorId(fornecedor_id) {
    // 1. Valida UUID
    const { error } = uuidSchema.validate(fornecedor_id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Verifica se fornecedor existe
    const fornecedorQuery = await database.query({
      text: "SELECT id FROM fornecedores WHERE id = $1 AND deletado_em IS NULL",
      values: [fornecedor_id],
    });

    if (fornecedorQuery.rows.length === 0) {
      throw new AppError("Fornecedor não encontrado", 404);
    }

    // 3. Busca lojas
    const lojas = await this.lojaFornecedorModel.selectLojasByFornecedorId(fornecedor_id);

    if (!lojas || lojas.length === 0) {
      return new DefaultResponseDto(true, "Nenhuma loja atendida por este fornecedor", []);
    }

    return new DefaultResponseDto(true, "Lojas encontradas com sucesso", lojas);
  }

  /**
   * Cria um novo vínculo loja-fornecedor
   * @param {Object} data - Dados do vínculo (loja_id, fornecedor_id)
   * @param {string} requestUserId - ID do usuário autenticado (JWT)
   * @returns {Promise<DefaultResponseDto>} Vínculo criado
   * @throws {AppError} 400 se validação falhar, 403 se não tem permissão, 404 se FK inválida, 409 se vínculo já existe
   */
  async create(data, requestUserId) {
    // 1. Validação com Joi
    const { error, value } = createLojaFornecedorSchema.validate(data, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Verifica se loja existe e se pertence ao usuário (IDOR)
    const lojaQuery = await database.query({
      text: "SELECT id, usuario_id FROM lojas WHERE id = $1 AND deletado_em IS NULL",
      values: [value.loja_id],
    });

    if (lojaQuery.rows.length === 0) {
      throw new AppError("Loja não encontrada", 404);
    }

    const loja = lojaQuery.rows[0];

    // 3. IDOR Protection: Verifica se a loja pertence ao usuário autenticado
    if (requestUserId && loja.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para vincular fornecedores a esta loja", 403);
    }

    // 4. Verifica se fornecedor existe
    const fornecedorQuery = await database.query({
      text: "SELECT id FROM fornecedores WHERE id = $1 AND deletado_em IS NULL",
      values: [value.fornecedor_id],
    });

    if (fornecedorQuery.rows.length === 0) {
      throw new AppError("Fornecedor não encontrado", 404);
    }

    // 5. Verifica se vínculo já existe
    const vinculoExists = await this.lojaFornecedorModel.selectByLojaAndFornecedor(value.loja_id, value.fornecedor_id);

    if (vinculoExists) {
      throw new AppError("Este fornecedor já está vinculado a esta loja", 409);
    }

    // 6. Cria vínculo
    const now = new Date();
    const novoVinculo = {
      loja_id: value.loja_id,
      fornecedor_id: value.fornecedor_id,
      criado_em: now,
      atualizado_em: now,
    };

    const vinculoCriado = await this.lojaFornecedorModel.create(novoVinculo);

    return new DefaultResponseDto(true, "Fornecedor vinculado à loja com sucesso", vinculoCriado);
  }

  /**
   * Deleta um vínculo loja-fornecedor (soft delete)
   * @param {string} loja_id - UUID da loja
   * @param {string} fornecedor_id - UUID do fornecedor
   * @param {string} requestUserId - ID do usuário autenticado (JWT)
   * @returns {Promise<DefaultResponseDto>} Confirmação de deleção
   * @throws {AppError} 400 se ID inválido, 403 se não tem permissão, 404 se vínculo não encontrado
   */
  async delete(loja_id, fornecedor_id, requestUserId) {
    // 1. Valida UUIDs
    const { error: lojaIdError } = uuidSchema.validate(loja_id);
    if (lojaIdError) {
      throw new AppError("ID da loja inválido", 400);
    }

    const { error: fornecedorIdError } = uuidSchema.validate(fornecedor_id);
    if (fornecedorIdError) {
      throw new AppError("ID do fornecedor inválido", 400);
    }

    // 2. Verifica se vínculo existe
    const vinculoExists = await this.lojaFornecedorModel.selectByLojaAndFornecedor(loja_id, fornecedor_id);

    if (!vinculoExists) {
      throw new AppError("Vínculo não encontrado", 404);
    }

    // 3. Verifica se loja pertence ao usuário (IDOR)
    const lojaQuery = await database.query({
      text: "SELECT usuario_id FROM lojas WHERE id = $1 AND deletado_em IS NULL",
      values: [loja_id],
    });

    if (lojaQuery.rows.length === 0) {
      throw new AppError("Loja não encontrada", 404);
    }

    const loja = lojaQuery.rows[0];

    // 4. IDOR Protection
    if (requestUserId && loja.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para desvincular fornecedores desta loja", 403);
    }

    // 5. Deleta vínculo (soft delete)
    await this.lojaFornecedorModel.delete(loja_id, fornecedor_id);

    return new DefaultResponseDto(true, "Fornecedor desvinculado da loja com sucesso", null);
  }
}

module.exports = LojaFornecedorService;
