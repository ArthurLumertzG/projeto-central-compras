const EnderecosModel = require("../models/enderecosModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { createEnderecoSchema, updateEnderecoSchema, uuidSchema, cepSchema } = require("../validations/enderecoValidation");

const { v4: uuidv4 } = require("uuid");

/**
 * @class EnderecosService
 * @description Service responsável pela lógica de negócio de endereços
 * Implementa validações Joi e soft delete
 */
class EnderecosService {
  constructor() {
    this.enderecosModel = new EnderecosModel();
  }

  /**
   * Retorna todos os endereços ativos (não deletados)
   *
   * @returns {Promise<DefaultResponseDto>} Lista de endereços
   */
  async getAll() {
    const enderecos = await this.enderecosModel.select();
    if (!enderecos || enderecos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum endereço encontrado", []);
    }

    return new DefaultResponseDto(true, "Endereços encontrados com sucesso", enderecos);
  }

  /**
   * Busca um endereço por ID
   *
   * @param {string} id - UUID do endereço
   * @returns {Promise<DefaultResponseDto>} Dados do endereço
   * @throws {AppError} 400 se ID inválido, 404 se não encontrado
   */
  async getById(id) {
    // Validação do UUID
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const endereco = await this.enderecosModel.selectById(id);
    if (!endereco) {
      throw new AppError("Endereço não encontrado", 404);
    }

    return new DefaultResponseDto(true, "Endereço encontrado com sucesso", endereco);
  }

  /**
   * Busca endereços por CEP
   *
   * @param {string} cep - CEP (com ou sem hífen)
   * @returns {Promise<DefaultResponseDto>} Lista de endereços
   * @throws {AppError} 400 se CEP inválido
   */
  async getByCep(cep) {
    // Validação do CEP
    const { error } = cepSchema.validate(cep);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    cep = cep.replace("-", ""); // Remove hífen se existir

    const enderecos = await this.enderecosModel.selectByCep(cep);

    if (!enderecos || enderecos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum endereço encontrado com este CEP", []);
    }

    return new DefaultResponseDto(true, "Endereços encontrados com sucesso", enderecos);
  }

  /**
   * Busca endereços por cidade e estado
   *
   * @param {string} cidade - Nome da cidade
   * @param {string} estado - Sigla do estado
   * @returns {Promise<DefaultResponseDto>} Lista de endereços
   * @throws {AppError} 400 se parâmetros inválidos
   */
  async getByCidadeEstado(cidade, estado) {
    if (!cidade || !estado) {
      throw new AppError("Cidade e estado são obrigatórios", 400);
    }

    if (estado.length !== 2) {
      throw new AppError("Estado deve ser uma sigla de 2 caracteres", 400);
    }

    const enderecos = await this.enderecosModel.selectByCidadeEstado(cidade, estado);

    if (!enderecos || enderecos.length === 0) {
      return new DefaultResponseDto(true, `Nenhum endereço encontrado em ${cidade}/${estado}`, []);
    }

    return new DefaultResponseDto(true, "Endereços encontrados com sucesso", enderecos);
  }

  /**
   * Cria um novo endereço
   * Valida dados com Joi
   *
   * @param {Object} enderecoData - Dados do endereço
   * @param {string} enderecoData.estado - Sigla do estado (2 caracteres)
   * @param {string} enderecoData.cidade - Nome da cidade
   * @param {string} enderecoData.bairro - Nome do bairro
   * @param {string} enderecoData.rua - Nome da rua
   * @param {string} enderecoData.numero - Número do endereço
   * @param {string} [enderecoData.complemento] - Complemento (opcional)
   * @param {string} enderecoData.cep - CEP
   * @returns {Promise<DefaultResponseDto>} Endereço criado
   * @throws {AppError} 400 se dados inválidos
   */
  async create(enderecoData) {
    // Validação com Joi
    const { error, value } = createEnderecoSchema.validate(enderecoData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join("; ");
      throw new AppError(errorMessages, 400);
    }

    // Normalizar estado para uppercase
    if (value.estado) {
      value.estado = value.estado.toUpperCase();
    }

    value.cep = value.cep.replace("-", "");

    // Criar endereço com timestamps
    const novoEndereco = {
      id: uuidv4(),
      ...value,
      criado_em: new Date(),
      atualizado_em: new Date(),
    };

    const endereçoCriado = await this.enderecosModel.create(novoEndereco);

    return new DefaultResponseDto(true, "Endereço criado com sucesso", endereçoCriado);
  }

  /**
   * Atualiza um endereço existente
   * Valida dados com Joi
   *
   * @param {string} id - UUID do endereço
   * @param {Object} updateData - Dados para atualização (campos opcionais)
   * @returns {Promise<DefaultResponseDto>} Endereço atualizado
   * @throws {AppError} 400 se dados inválidos, 404 se não encontrado
   */
  async update(id, updateData) {
    // Validação do UUID
    const idValidation = uuidSchema.validate(id);
    if (idValidation.error) {
      throw new AppError(idValidation.error.details[0].message, 400);
    }

    // Validação dos dados de atualização
    const { error, value } = updateEnderecoSchema.validate(updateData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join("; ");
      throw new AppError(errorMessages, 400);
    }

    // Normalizar estado para uppercase se fornecido
    if (value.estado) {
      value.estado = value.estado.toUpperCase();
    }

    // Adicionar timestamp de atualização
    const enderecoToUpdate = {
      ...value,
      atualizado_em: new Date(),
    };

    const enderecoAtualizado = await this.enderecosModel.update(id, enderecoToUpdate);

    if (!enderecoAtualizado) {
      throw new AppError("Endereço não encontrado", 404);
    }

    return new DefaultResponseDto(true, "Endereço atualizado com sucesso", enderecoAtualizado);
  }

  /**
   * Deleta um endereço (soft delete)
   * O endereço não é removido do banco, apenas marcado como deletado
   *
   * @param {string} id - UUID do endereço
   * @returns {Promise<DefaultResponseDto>} Confirmação de exclusão
   * @throws {AppError} 400 se ID inválido, 404 se não encontrado
   */
  async delete(id) {
    // Validação do UUID
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const enderecoIsDeleted = await this.enderecosModel.delete(id);

    if (!enderecoIsDeleted) {
      throw new AppError("Endereço não encontrado", 404);
    }

    return new DefaultResponseDto(true, "Endereço deletado com sucesso", null);
  }

  /**
   * Verifica se um endereço existe (usado por outros módulos)
   *
   * @param {string} id - UUID do endereço
   * @returns {Promise<boolean>} true se existe, false caso contrário
   */
  async exists(id) {
    // Validação do UUID
    const { error } = uuidSchema.validate(id);
    if (error) {
      return false;
    }

    return await this.enderecosModel.exists(id);
  }
}

module.exports = EnderecosService;
