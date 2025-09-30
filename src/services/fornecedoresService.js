const FornecedoresModel = require("../models/fornecedoresModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { validateFornecedor } = require("../utils/validator");

const { v4: uuidv4 } = require("uuid");

class FornecedoresService {
  constructor() {
    this.fornecedoresModel = new FornecedoresModel();
  }

  async getAll() {
    const fornecedores = await this.fornecedoresModel.select();
    if (!fornecedores || fornecedores.length === 0) {
      return new DefaultResponseDto(true, "Nenhum fornecedor encontrado", []);
    }

    return new DefaultResponseDto(true, "Fornecedores encontrados com sucesso", fornecedores);
  }

  async getById(id) {
    const fornecedor = await this.fornecedoresModel.selectById(id);
    if (!fornecedor) {
      throw new AppError("Fornecedor não encontrado", 404);
    }
    return new DefaultResponseDto(true, "Fornecedor encontrado com sucesso", fornecedor);
  }

  async getByEmail(email) {
    const fornecedor = await this.fornecedoresModel.selectByEmail(email);
    if (!fornecedor) {
      throw new AppError("Fornecedor não encontrado", 404);
    }
    return new DefaultResponseDto(true, "Fornecedor encontrado com sucesso", fornecedor);
  }

  async create(fornecedor) {
    const fornecedorError = validateFornecedor(fornecedor);
    if (fornecedorError) throw new AppError(fornecedorError, 400);

    fornecedor.email = fornecedor.email.toLowerCase();
    const { email } = fornecedor;
    const existingFornecedor = await this.fornecedoresModel.selectByEmail(email);

    if (existingFornecedor) {
      throw new AppError("Já existe um fornecedor com este email", 409);
    }

    const newId = uuidv4();
    const newFornecedor = {
      id: newId,
      ...fornecedor,
    };

    const createdFornecedor = await this.fornecedoresModel.create(newFornecedor);

    return new DefaultResponseDto(true, "Fornecedor criado com sucesso", createdFornecedor);
  }

  async update(id, fornecedor) {
    const updatedFornecedor = await this.fornecedoresModel.update(id, fornecedor);
    if (!updatedFornecedor) {
      throw new AppError(`Fornecedor não encontrado`, 404);
    }

    return new DefaultResponseDto(true, "Fornecedor atualizado com sucesso", updatedFornecedor);
  }

  async delete(id) {
    const fornecedorIsDeleted = await this.fornecedoresModel.delete(id);
    if (!fornecedorIsDeleted) {
      throw new AppError(`Fornecedor não encontrado`, 404);
    }

    return new DefaultResponseDto(true, "Fornecedor deletado com sucesso", null);
  }
}

module.exports = FornecedoresService;
