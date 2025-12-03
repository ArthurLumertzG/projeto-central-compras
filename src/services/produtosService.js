const ProdutosModel = require("../models/produtosModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { createProdutoSchema, updateProdutoSchema, uuidSchema, nomeSchema } = require("../validations/produtoValidation");


class ProdutosService {
  constructor() {
    this.produtosModel = new ProdutosModel();
  }

  async getAll() {
    const produtos = await this.produtosModel.select();
    if (!produtos || produtos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum produto encontrado", []);
    }

    return new DefaultResponseDto(true, "Produtos encontrados com sucesso", produtos);
  }

  async getById(id) {
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

  async getByName(nome) {
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

  async create(produtoData) {
    const { error, value } = createProdutoSchema.validate(produtoData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join("; ");
      throw new AppError(errorMessages, 400);
    }

    const existingProduto = await this.produtosModel.selectByName(value.nome);

    if (existingProduto) {
      throw new AppError("Já existe um produto com este nome", 409);
    }

    const newProduto = {
      ...value
    };

    const createdProduto = await this.produtosModel.create(newProduto);

    return new DefaultResponseDto(true, "Produto criado com sucesso", createdProduto);
  }

  async update(id, updateData) {
    const idValidation = uuidSchema.validate(id);
    if (idValidation.error) {
      throw new AppError(idValidation.error.details[0].message, 400);
    }

    const { error, value } = updateProdutoSchema.validate(updateData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join("; ");
      throw new AppError(errorMessages, 400);
    }

    if (value.nome) {
      const existingProduto = await this.produtosModel.selectByName(value.nome);
      if (existingProduto && existingProduto.id.toString() !== id.toString()) {
        throw new AppError("Já existe um produto com este nome", 409);
      }
    }

    const produtoToUpdate = {
      ...value
    };

    const updatedProduto = await this.produtosModel.update(id, produtoToUpdate);

    if (!updatedProduto) {
      throw new AppError("Produto não encontrado", 404);
    }

    return new DefaultResponseDto(true, "Produto atualizado com sucesso", updatedProduto);
  }

  async delete(id) {
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

  async getByFornecedor(fornecedorId) {
    const { error } = uuidSchema.validate(fornecedorId);
    if (error) {
      throw new AppError("ID do fornecedor inválido", 400);
    }

    const produtos = await this.produtosModel.selectByFornecedor(fornecedorId);
    return new DefaultResponseDto(true, "Produtos recuperados com sucesso", produtos);
  }
}

module.exports = ProdutosService;
