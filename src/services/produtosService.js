const ProdutosModel = require("../models/produtosModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { validateProduto } = require("../utils/validator");

const { v4: uuidv4 } = require("uuid");

class ProdutosService {
  constructor() {
    this.produtosModel = new ProdutosModel();
  }

  async getAll() {
    const produtos = await this.produtosModel.select();
    if (!produtos || produtos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum produto encontrado", []);
    }

    return new DefaultResponseDto(
      true,
      "Produtos encontrados com sucesso",
      produtos
    );
  }

  async getById(id) {
    const produto = await this.produtosModel.selectById(id);
    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }
    return new DefaultResponseDto(
      true,
      "Produto encontrado com sucesso",
      produto
    );
  }

  async getByName(nome) {
    const produto = await this.produtosModel.selectByName(nome);

    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }

    return new DefaultResponseDto(
      true,
      "Produto encontrado com sucesso",
      produto
    );
  }

  async create(produto) {
    const produtoError = await validateProduto(produto);
    if (produtoError) throw new AppError(produtoError, 400);

    const { nome } = produto;
    const existingProduto = await this.produtosModel.selectByName(nome);

    if (existingProduto) {
      throw new AppError("Já existe um produto com este nome", 409);
    }

    const newId = uuidv4();
    const newProduto = {
      id: newId,
      ...produto,
    };

    const createdProduto = await this.produtosModel.create(newProduto);

    return new DefaultResponseDto(
      true,
      "Produto criado com sucesso",
      createdProduto
    );
  }

  async update(id, produto) {
    const updatedProduto = await this.produtosModel.update(id, produto);
    if (!updatedProduto) {
      throw new AppError(`Produto não encontrado`, 404);
    }

    return new DefaultResponseDto(
      true,
      "Produto atualizado com sucesso",
      updatedProduto
    );
  }

  async delete(id) {
    const produtoIsDeleted = await this.produtosModel.delete(id);
    if (!produtoIsDeleted) {
      throw new AppError(`Produto não encontrado`, 404);
    }

    return new DefaultResponseDto(true, "Produto deletado com sucesso", null);
  }
}

module.exports = ProdutosService;
