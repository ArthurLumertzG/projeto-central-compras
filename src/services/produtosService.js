const ProdutosModel = require("../models/produtosModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { createProdutoSchema, updateProdutoSchema, uuidSchema, nomeSchema } = require("../validations/produtoValidation");

const { v4: uuidv4 } = require("uuid");

/**
 * @class ProdutosService
 * @description Service responsável pela lógica de negócio de produtos
 * Implementa validações Joi, verificação de duplicatas e soft delete
 */
class ProdutosService {
  constructor() {
    this.produtosModel = new ProdutosModel();
  }

  /**
   * Retorna todos os produtos ativos (não deletados)
   *
   * @returns {Promise<DefaultResponseDto>} Lista de produtos
   */
  async getAll() {
    const produtos = await this.produtosModel.select();
    if (!produtos || produtos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum produto encontrado", []);
    }

    return new DefaultResponseDto(true, "Produtos encontrados com sucesso", produtos);
  }

  /**
   * Busca um produto por ID
   *
   * @param {string} id - UUID do produto
   * @returns {Promise<DefaultResponseDto>} Dados do produto
   * @throws {AppError} 400 se ID inválido, 404 se não encontrado
   */
  async getById(id) {
    // Validação do UUID
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const produto = await this.produtosModel.selectById(id);
    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }

    return new DefaultResponseDto(true, "Produto encontrado com sucesso", produto);
  }

  /**
   * Busca um produto por nome
   *
   * @param {string} nome - Nome do produto (case-insensitive)
   * @returns {Promise<DefaultResponseDto>} Dados do produto
   * @throws {AppError} 400 se nome inválido, 404 se não encontrado
   */
  async getByName(nome) {
    // Validação do nome
    const { error } = nomeSchema.validate(nome);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const produto = await this.produtosModel.selectByName(nome);

    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }

    return new DefaultResponseDto(true, "Produto encontrado com sucesso", produto);
  }

  /**
   * Cria um novo produto
   * Valida dados com Joi e verifica se já existe produto com o mesmo nome
   *
   * @param {Object} produtoData - Dados do produto
   * @param {string} produtoData.nome - Nome do produto
   * @param {string} produtoData.descricao - Descrição do produto
   * @param {number} produtoData.valor_unitario - Valor unitário
   * @param {number} produtoData.quantidade_estoque - Quantidade em estoque
   * @param {string} produtoData.fornecedor_id - UUID do fornecedor
   * @param {string} produtoData.categoria - Categoria do produto
   * @returns {Promise<DefaultResponseDto>} Produto criado
   * @throws {AppError} 400 se dados inválidos, 409 se nome duplicado
   */
  async create(produtoData) {
    // Validação com Joi
    const { error, value } = createProdutoSchema.validate(produtoData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join("; ");
      throw new AppError(errorMessages, 400);
    }

    // Verificar se já existe produto com o mesmo nome
    const existingProduto = await this.produtosModel.selectByName(value.nome);

    if (existingProduto) {
      throw new AppError("Já existe um produto com este nome", 409);
    }

    // Criar produto com timestamps
    const newProduto = {
      id: uuidv4(),
      ...value,
      criado_em: new Date(),
      atualizado_em: new Date(),
    };

    const createdProduto = await this.produtosModel.create(newProduto);

    return new DefaultResponseDto(true, "Produto criado com sucesso", createdProduto);
  }

  /**
   * Atualiza um produto existente
   * Valida dados com Joi e verifica se nome não está duplicado
   *
   * @param {string} id - UUID do produto
   * @param {Object} updateData - Dados para atualização (campos opcionais)
   * @returns {Promise<DefaultResponseDto>} Produto atualizado
   * @throws {AppError} 400 se dados inválidos, 404 se não encontrado, 409 se nome duplicado
   */
  async update(id, updateData) {
    // Validação do UUID
    const idValidation = uuidSchema.validate(id);
    if (idValidation.error) {
      throw new AppError(idValidation.error.details[0].message, 400);
    }

    // Validação dos dados de atualização
    const { error, value } = updateProdutoSchema.validate(updateData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join("; ");
      throw new AppError(errorMessages, 400);
    }

    // Se está alterando o nome, verificar duplicata
    if (value.nome) {
      const existingProduto = await this.produtosModel.selectByName(value.nome);
      if (existingProduto && existingProduto.id !== id) {
        throw new AppError("Já existe um produto com este nome", 409);
      }
    }

    // Adicionar timestamp de atualização
    const produtoToUpdate = {
      ...value,
      atualizado_em: new Date(),
    };

    const updatedProduto = await this.produtosModel.update(id, produtoToUpdate);

    if (!updatedProduto) {
      throw new AppError("Produto não encontrado", 404);
    }

    return new DefaultResponseDto(true, "Produto atualizado com sucesso", updatedProduto);
  }

  /**
   * Deleta um produto (soft delete)
   * O produto não é removido do banco, apenas marcado como deletado
   *
   * @param {string} id - UUID do produto
   * @returns {Promise<DefaultResponseDto>} Confirmação de exclusão
   * @throws {AppError} 400 se ID inválido, 404 se não encontrado
   */
  async delete(id) {
    // Validação do UUID
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const produtoIsDeleted = await this.produtosModel.delete(id);

    if (!produtoIsDeleted) {
      throw new AppError("Produto não encontrado", 404);
    }

    return new DefaultResponseDto(true, "Produto deletado com sucesso", null);
  }
}

module.exports = ProdutosService;
