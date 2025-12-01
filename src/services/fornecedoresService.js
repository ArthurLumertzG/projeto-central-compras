const { v4: uuidv4 } = require("uuid");
const FornecedoresModel = require("../models/fornecedoresModel");
const Fornecedor = require("../entities/fornecedor");
const AppError = require("../errors/AppError");
const { createFornecedorSchema, updateFornecedorSchema, uuidSchema, cnpjSchema } = require("../validations/fornecedorValidation");

/**
 * @class FornecedoresService
 * @description Service responsável pela lógica de negócio de fornecedores
 * Implementa validações com Joi, foreign keys e regras de negócio
 */
class FornecedoresService {
  constructor() {
    this.fornecedoresModel = new FornecedoresModel();
  }

  /**
   * Retorna todos os fornecedores ativos
   * @returns {Promise<Array<Object>>} Lista de fornecedores no formato público
   * @throws {AppError} Se ocorrer erro na busca
   */
  async getAll() {
    const fornecedores = await this.fornecedoresModel.select();
    return fornecedores.map((fornecedorData) => {
      const fornecedor = new Fornecedor(
        fornecedorData.id,
        fornecedorData.cnpj,
        fornecedorData.razao_social,
        fornecedorData.nome_fantasia,
        fornecedorData.descricao,
        fornecedorData.usuario_id,
        fornecedorData.criado_em,
        fornecedorData.atualizado_em,
        fornecedorData.deletado_em
      );
      return fornecedor.toPublic();
    });
  }

  /**
   * Busca um fornecedor por ID
   * @param {string} id - UUID do fornecedor
   * @returns {Promise<Object>} Fornecedor no formato público
   * @throws {AppError} 400 se ID inválido, 404 se não encontrado
   */
  async getById(id) {
    // Valida UUID
    const { error: uuidError } = uuidSchema.validate(id);
    if (uuidError) {
      throw new AppError("ID do fornecedor inválido", 400);
    }

    const fornecedorData = await this.fornecedoresModel.selectById(id);
    if (!fornecedorData) {
      throw new AppError("Fornecedor não encontrado", 404);
    }

    const fornecedor = new Fornecedor(
      fornecedorData.id,
      fornecedorData.cnpj,
      fornecedorData.razao_social,
      fornecedorData.nome_fantasia,
      fornecedorData.descricao,
      fornecedorData.usuario_id,
      fornecedorData.criado_em,
      fornecedorData.atualizado_em,
      fornecedorData.deletado_em
    );

    return fornecedor.toPublic();
  }

  /**
   * Busca fornecedores por usuário responsável
   * @param {string} usuario_id - UUID do usuário
   * @returns {Promise<Array<Object>>} Lista de fornecedores do usuário
   * @throws {AppError} 400 se ID inválido
   */
  async getByUsuarioId(usuario_id) {
    // Valida UUID
    const { error: uuidError } = uuidSchema.validate(usuario_id);
    if (uuidError) {
      throw new AppError("ID do usuário inválido", 400);
    }

    const fornecedores = await this.fornecedoresModel.selectByUsuarioId(usuario_id);
    return fornecedores.map((fornecedorData) => {
      const fornecedor = new Fornecedor(
        fornecedorData.id,
        fornecedorData.cnpj,
        fornecedorData.razao_social,
        fornecedorData.nome_fantasia,
        fornecedorData.descricao,
        fornecedorData.usuario_id,
        fornecedorData.criado_em,
        fornecedorData.atualizado_em,
        fornecedorData.deletado_em
      );
      return fornecedor.toPublic();
    });
  }

  /**
   * Busca um fornecedor por CNPJ
   * @param {string} cnpj - CNPJ do fornecedor (14 dígitos)
   * @returns {Promise<Object>} Fornecedor no formato público
   * @throws {AppError} 400 se CNPJ inválido, 404 se não encontrado
   */
  async getByCnpj(cnpj) {
    // Valida CNPJ
    const { error: cnpjError } = cnpjSchema.validate(cnpj);
    if (cnpjError) {
      throw new AppError("CNPJ inválido. Deve conter exatamente 14 dígitos", 400);
    }

    const fornecedorData = await this.fornecedoresModel.selectByCnpj(cnpj);
    if (!fornecedorData) {
      throw new AppError("Fornecedor não encontrado", 404);
    }

    const fornecedor = new Fornecedor(
      fornecedorData.id,
      fornecedorData.cnpj,
      fornecedorData.razao_social,
      fornecedorData.nome_fantasia,
      fornecedorData.descricao,
      fornecedorData.usuario_id,
      fornecedorData.criado_em,
      fornecedorData.atualizado_em,
      fornecedorData.deletado_em
    );

    return fornecedor.toPublic();
  }

  /**
   * Cria um novo fornecedor com validações completas
   * @param {Object} data - Dados do fornecedor (cnpj, descricao, usuario_id)
   * @returns {Promise<Object>} Fornecedor criado no formato público
   * @throws {AppError} 400 se dados inválidos, 404 se usuário não existe, 409 se CNPJ duplicado
   */
  async create(data) {
    // 1. Validação com Joi
    const { error, value } = createFornecedorSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      throw new AppError(`Erro de validação: ${errors.join(", ")}`, 400);
    }

    // 2. Verifica se usuário existe (apenas se fornecido)
    if (value.usuario_id) {
      const { default: UsuariosModel } = await import("../models/usuariosModel.js");
      const usuariosModel = new UsuariosModel();
      const usuarioExists = await usuariosModel.selectById(value.usuario_id);

      if (!usuarioExists) {
        throw new AppError("Usuário não encontrado. Use um usuário válido.", 404);
      }
    }

    // 3. Verifica se CNPJ já existe
    const cnpjExists = await this.fornecedoresModel.selectByCnpj(value.cnpj);
    if (cnpjExists) {
      throw new AppError("Já existe um fornecedor cadastrado com este CNPJ", 409);
    }

    // 4. Cria entidade com timestamps
    const fornecedor = new Fornecedor(uuidv4(), value.cnpj, value.razao_social || null, value.nome_fantasia || null, value.descricao || null, value.usuario_id || null, new Date(), new Date(), null);

    // 5. Salva no banco
    const fornecedorData = await this.fornecedoresModel.create(fornecedor);
    const fornecedorCreated = new Fornecedor(
      fornecedorData.id,
      fornecedorData.cnpj,
      fornecedorData.razao_social,
      fornecedorData.nome_fantasia,
      fornecedorData.descricao,
      fornecedorData.usuario_id,
      fornecedorData.criado_em,
      fornecedorData.atualizado_em,
      fornecedorData.deletado_em
    );

    return fornecedorCreated.toPublic();
  }

  /**
   * Atualiza um fornecedor existente
   * @param {string} id - UUID do fornecedor
   * @param {Object} data - Dados para atualização (cnpj, descricao, usuario_id)
   * @param {string} requestUserId - UUID do usuário autenticado fazendo a requisição
   * @returns {Promise<Object>} Fornecedor atualizado no formato público
   * @throws {AppError} 400 se dados inválidos, 403 se tentar atualizar fornecedor de outro usuário, 404 se fornecedor/usuário não existe, 409 se CNPJ duplicado
   */
  async update(id, data, requestUserId) {
    // 1. Valida UUID
    const { error: uuidError } = uuidSchema.validate(id);
    if (uuidError) {
      throw new AppError("ID do fornecedor inválido", 400);
    }

    // 2. Verifica se fornecedor existe
    const fornecedorExists = await this.fornecedoresModel.selectById(id);
    if (!fornecedorExists) {
      throw new AppError("Fornecedor não encontrado", 404);
    }

    // 3. VERIFICAÇÃO DE SEGURANÇA: Usuário só pode atualizar seus próprios fornecedores
    if (requestUserId && fornecedorExists.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para atualizar este fornecedor", 403);
    }

    // 4. Validação com Joi
    const { error, value } = updateFornecedorSchema.validate(data, {
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

    // 7. Verifica se CNPJ já existe (se fornecido e diferente do atual)
    if (value.cnpj && value.cnpj !== fornecedorExists.cnpj) {
      const cnpjExists = await this.fornecedoresModel.selectByCnpj(value.cnpj);
      if (cnpjExists && cnpjExists.id !== id) {
        throw new AppError("Já existe um fornecedor cadastrado com este CNPJ", 409);
      }
    }

    // 8. Adiciona timestamp de atualização
    value.atualizado_em = new Date();

    // 9. Atualiza no banco
    const fornecedorData = await this.fornecedoresModel.update(id, value);
    if (!fornecedorData) {
      throw new AppError("Erro ao atualizar fornecedor", 500);
    }

    const fornecedorUpdated = new Fornecedor(
      fornecedorData.id,
      fornecedorData.cnpj,
      fornecedorData.razao_social,
      fornecedorData.nome_fantasia,
      fornecedorData.descricao,
      fornecedorData.usuario_id,
      fornecedorData.criado_em,
      fornecedorData.atualizado_em,
      fornecedorData.deletado_em
    );

    return fornecedorUpdated.toPublic();
  }

  /**
   * Deleta um fornecedor (soft delete)
   * @param {string} id - UUID do fornecedor
   * @param {string} requestUserId - UUID do usuário autenticado fazendo a requisição
   * @returns {Promise<void>}
   * @throws {AppError} 400 se ID inválido, 403 se tentar deletar fornecedor de outro usuário, 404 se não encontrado
   */
  async delete(id, requestUserId) {
    // 1. Valida UUID
    const { error: uuidError } = uuidSchema.validate(id);
    if (uuidError) {
      throw new AppError("ID do fornecedor inválido", 400);
    }

    // 2. Verifica se fornecedor existe
    const fornecedorExists = await this.fornecedoresModel.selectById(id);
    if (!fornecedorExists) {
      throw new AppError("Fornecedor não encontrado", 404);
    }

    // 3. VERIFICAÇÃO DE SEGURANÇA: Usuário só pode deletar seus próprios fornecedores
    if (requestUserId && fornecedorExists.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para deletar este fornecedor", 403);
    }

    // 4. Deleta (soft delete)
    const deleted = await this.fornecedoresModel.delete(id);
    if (!deleted) {
      throw new AppError("Erro ao deletar fornecedor", 500);
    }
  }

  /**
   * Verifica se um fornecedor existe pelo ID
   * @param {string} id - UUID do fornecedor
   * @returns {Promise<boolean>} true se existe, false caso contrário
   */
  async exists(id) {
    const { error } = uuidSchema.validate(id);
    if (error) return false;

    const fornecedor = await this.fornecedoresModel.selectById(id);
    return !!fornecedor;
  }
}

module.exports = FornecedoresService;
