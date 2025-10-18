const { v4: uuidv4 } = require("uuid");
const LojasModel = require("../models/lojasModel");
const Loja = require("../entities/loja");
const AppError = require("../errors/AppError");
const { createLojaSchema, updateLojaSchema, uuidSchema, cnpjSchema } = require("../validations/lojaValidation");

/**
 * @class LojasService
 * @description Service responsável pela lógica de negócio de lojas
 * Implementa validações com Joi, foreign keys e regras de negócio
 */
class LojasService {
  constructor() {
    this.lojasModel = new LojasModel();
  }

  /**
   * Retorna todas as lojas ativas
   * @returns {Promise<Array<Object>>} Lista de lojas no formato público
   * @throws {AppError} Se ocorrer erro na busca
   */
  async getAll() {
    const lojas = await this.lojasModel.select();
    return lojas.map((lojaData) => {
      const loja = new Loja(lojaData.id, lojaData.nome, lojaData.cnpj, lojaData.usuario_id, lojaData.endereco_id, lojaData.criado_em, lojaData.atualizado_em, lojaData.deletado_em);
      return loja.toPublic();
    });
  }

  /**
   * Busca uma loja por ID
   * @param {string} id - UUID da loja
   * @returns {Promise<Object>} Loja no formato público
   * @throws {AppError} 400 se ID inválido, 404 se não encontrada
   */
  async getById(id) {
    // Valida UUID
    const { error: uuidError } = uuidSchema.validate(id);
    if (uuidError) {
      throw new AppError("ID da loja inválido", 400);
    }

    const lojaData = await this.lojasModel.selectById(id);
    if (!lojaData) {
      throw new AppError("Loja não encontrada", 404);
    }

    const loja = new Loja(lojaData.id, lojaData.nome, lojaData.cnpj, lojaData.usuario_id, lojaData.endereco_id, lojaData.criado_em, lojaData.atualizado_em, lojaData.deletado_em);

    return loja.toPublic();
  }

  /**
   * Busca lojas por usuário responsável
   * @param {string} usuario_id - UUID do usuário
   * @returns {Promise<Array<Object>>} Lista de lojas do usuário
   * @throws {AppError} 400 se ID inválido
   */
  async getByUsuarioId(usuario_id) {
    // Valida UUID
    const { error: uuidError } = uuidSchema.validate(usuario_id);
    if (uuidError) {
      throw new AppError("ID do usuário inválido", 400);
    }

    const lojas = await this.lojasModel.selectByUsuarioId(usuario_id);
    return lojas.map((lojaData) => {
      const loja = new Loja(lojaData.id, lojaData.nome, lojaData.cnpj, lojaData.usuario_id, lojaData.endereco_id, lojaData.criado_em, lojaData.atualizado_em, lojaData.deletado_em);
      return loja.toPublic();
    });
  }

  /**
   * Cria uma nova loja com validações completas
   * @param {Object} data - Dados da loja (nome, cnpj, usuario_id, endereco_id)
   * @returns {Promise<Object>} Loja criada no formato público
   * @throws {AppError} 400 se dados inválidos, 404 se usuário/endereço não existe, 409 se CNPJ duplicado
   */
  async create(data) {
    // 1. Validação com Joi
    const { error, value } = createLojaSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      throw new AppError(`Erro de validação: ${errors.join(", ")}`, 400);
    }

    // 2. Verifica se usuário existe
    const { default: UsuariosModel } = await import("../models/usuariosModel.js");
    const usuariosModel = new UsuariosModel();
    const usuarioExists = await usuariosModel.selectById(value.usuario_id);

    if (!usuarioExists) {
      throw new AppError("Usuário não encontrado. Use um usuário válido.", 404);
    }

    // 3. Verifica se endereço existe (se fornecido)
    if (value.endereco_id) {
      const { default: EnderecosModel } = await import("../models/enderecosModel.js");
      const enderecosModel = new EnderecosModel();
      const enderecoExists = await enderecosModel.selectById(value.endereco_id);

      if (!enderecoExists) {
        throw new AppError("Endereço não encontrado. Crie ou use um endereço válido.", 404);
      }
    }

    // 4. Verifica se CNPJ já existe
    const cnpjExists = await this.lojasModel.selectByCnpj(value.cnpj);
    if (cnpjExists) {
      throw new AppError("Já existe uma loja cadastrada com este CNPJ", 409);
    }

    // 5. Cria entidade com timestamps
    const loja = new Loja(uuidv4(), value.nome, value.cnpj, value.usuario_id, value.endereco_id || null, new Date(), new Date(), null);

    // 6. Salva no banco
    const lojaData = await this.lojasModel.create(loja);
    const lojaCreated = new Loja(lojaData.id, lojaData.nome, lojaData.cnpj, lojaData.usuario_id, lojaData.endereco_id, lojaData.criado_em, lojaData.atualizado_em, lojaData.deletado_em);

    return lojaCreated.toPublic();
  }

  /**
   * Atualiza uma loja existente
   * @param {string} id - UUID da loja
   * @param {Object} data - Dados para atualização (nome, cnpj, usuario_id, endereco_id)
   * @param {string} requestUserId - UUID do usuário autenticado fazendo a requisição
   * @returns {Promise<Object>} Loja atualizada no formato público
   * @throws {AppError} 400 se dados inválidos, 403 se tentar atualizar loja de outro usuário, 404 se loja/usuário/endereço não existe, 409 se CNPJ duplicado
   */
  async update(id, data, requestUserId) {
    // 1. Valida UUID
    const { error: uuidError } = uuidSchema.validate(id);
    if (uuidError) {
      throw new AppError("ID da loja inválido", 400);
    }

    // 2. Verifica se loja existe
    const lojaExists = await this.lojasModel.selectById(id);
    if (!lojaExists) {
      throw new AppError("Loja não encontrada", 404);
    }

    // 3. VERIFICAÇÃO DE SEGURANÇA: Usuário só pode atualizar suas próprias lojas
    if (requestUserId && lojaExists.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para atualizar esta loja", 403);
    }

    // 4. Validação com Joi
    const { error, value } = updateLojaSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      throw new AppError(`Erro de validação: ${errors.join(", ")}`, 400);
    }

    // 5. Verifica se há campos para atualizar
    if (Object.keys(value).length === 0) {
      throw new AppError("Nenhum campo para atualizar foi fornecido", 400);
    }

    // 6. Verifica se usuário existe (se fornecido)
    if (value.usuario_id) {
      const { default: UsuariosModel } = await import("../models/usuariosModel.js");
      const usuariosModel = new UsuariosModel();
      const usuarioExists = await usuariosModel.selectById(value.usuario_id);

      if (!usuarioExists) {
        throw new AppError("Usuário não encontrado. Use um usuário válido.", 404);
      }
    }

    // 7. Verifica se endereço existe (se fornecido)
    if (value.endereco_id) {
      const { default: EnderecosModel } = await import("../models/enderecosModel.js");
      const enderecosModel = new EnderecosModel();
      const enderecoExists = await enderecosModel.selectById(value.endereco_id);

      if (!enderecoExists) {
        throw new AppError("Endereço não encontrado. Use um endereço válido.", 404);
      }
    }

    // 8. Verifica se CNPJ já existe (se fornecido e diferente do atual)
    if (value.cnpj && value.cnpj !== lojaExists.cnpj) {
      const cnpjExists = await this.lojasModel.selectByCnpj(value.cnpj);
      if (cnpjExists && cnpjExists.id !== id) {
        throw new AppError("Já existe uma loja cadastrada com este CNPJ", 409);
      }
    }

    // 9. Adiciona timestamp de atualização
    value.atualizado_em = new Date();

    // 10. Atualiza no banco
    const lojaData = await this.lojasModel.update(id, value);
    if (!lojaData) {
      throw new AppError("Erro ao atualizar loja", 500);
    }

    const lojaUpdated = new Loja(lojaData.id, lojaData.nome, lojaData.cnpj, lojaData.usuario_id, lojaData.endereco_id, lojaData.criado_em, lojaData.atualizado_em, lojaData.deletado_em);

    return lojaUpdated.toPublic();
  }

  /**
   * Deleta uma loja (soft delete)
   * @param {string} id - UUID da loja
   * @param {string} requestUserId - UUID do usuário autenticado fazendo a requisição
   * @returns {Promise<void>}
   * @throws {AppError} 400 se ID inválido, 403 se tentar deletar loja de outro usuário, 404 se não encontrada
   */
  async delete(id, requestUserId) {
    // 1. Valida UUID
    const { error: uuidError } = uuidSchema.validate(id);
    if (uuidError) {
      throw new AppError("ID da loja inválido", 400);
    }

    // 2. Verifica se loja existe
    const lojaExists = await this.lojasModel.selectById(id);
    if (!lojaExists) {
      throw new AppError("Loja não encontrada", 404);
    }

    // 3. VERIFICAÇÃO DE SEGURANÇA: Usuário só pode deletar suas próprias lojas
    if (requestUserId && lojaExists.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para deletar esta loja", 403);
    }

    // 4. Deleta (soft delete)
    const deleted = await this.lojasModel.delete(id);
    if (!deleted) {
      throw new AppError("Erro ao deletar loja", 500);
    }
  }

  /**
   * Verifica se uma loja existe pelo ID
   * @param {string} id - UUID da loja
   * @returns {Promise<boolean>} true se existe, false caso contrário
   */
  async exists(id) {
    const { error } = uuidSchema.validate(id);
    if (error) return false;

    const loja = await this.lojasModel.selectById(id);
    return !!loja;
  }
}

module.exports = LojasService;
