const fs = require("fs").promises;
const path = require("path");

const dataFile = path.join(__dirname, "../../db/fornecedores.json");

class FornecedoresModel {
  constructor() {
    this.file = dataFile;
  }

  async select() {
    let fileContent;
    try {
      fileContent = await fs.readFile(this.file, "utf8");
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.writeFile(this.file, "[]", "utf8");
        return [];
      }
      throw err;
    }

    if (!fileContent.trim()) {
      return [];
    }

    try {
      return JSON.parse(fileContent);
    } catch (err) {
      console.warn("Arquivo JSON inválido. Resetando para [].");
      await fs.writeFile(this.file, "[]", "utf8");
      return [];
    }
  }

  async selectById(id) {
    const fornecedores = await this.select();
    return fornecedores.find((fornecedor) => fornecedor.id === id);
  }

  async selectByEmail(email) {
    const fornecedores = await this.select();
    return fornecedores.find((fornecedor) => fornecedor.email === email);
  }

  async create(fornecedor) {
    const fornecedores = await this.select();
    fornecedores.push(fornecedor);
    const json = JSON.stringify(fornecedores, null, 2);
    await fs.writeFile(this.file, json, "utf8");
    return fornecedor;
  }

  async update(id, fornecedor) {
    const fornecedores = await this.select();
    const updatedFornecedorIndex = fornecedores.findIndex((fornecedor) => fornecedor.id === id);

    if (updatedFornecedorIndex === -1) return null;

    fornecedores[updatedFornecedorIndex] = { ...fornecedores[updatedFornecedorIndex], ...fornecedor };

    await fs.writeFile(this.file, JSON.stringify(fornecedores, null, 2), "utf8");
    return fornecedores[updatedFornecedorIndex];
  }

  async delete(id) {
    const fornecedores = await this.select();
    const deletedFornecedorIndex = fornecedores.findIndex((fornecedor) => fornecedor.id === id);

    if (deletedFornecedorIndex === -1) return null;

    fornecedores.splice(deletedFornecedorIndex, 1);
    await fs.writeFile(this.file, JSON.stringify(fornecedores, null, 2), "utf8");
    return true;
  }
}

module.exports = FornecedoresModel;
