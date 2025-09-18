const FornecedoresModel = require("../models/fornecedoresModel");
const { v4: uuidv4 } = require("uuid");

class FornecedoresService {
  constructor() {
    this.fornecedoresModel = new FornecedoresModel();
  }

  getAllFornecedores() {
    return "get all";
  }

  async createFornecedor(fornecedor) {
    if (!fornecedor) {
      throw new Error("Fornecedor não informado");
    }
    const { nome, categoria, email, telefone, status } = fornecedor;
    if (!(nome && categoria && email && telefone && status)) {
      throw new Error("Há dados faltantes.");
    }
    const newId = uuidv4();
    const newFornecedor = {
      id: newId,
      ...fornecedor,
    };

    await this.fornecedoresModel.create(newFornecedor);
    return "Fornecedor criado";
  }
}

module.exports = FornecedoresService;
