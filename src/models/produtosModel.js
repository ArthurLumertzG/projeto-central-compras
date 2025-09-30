const fs = require("fs").promises;
const path = require("path");

const dataFile = path.join(__dirname, "../../db/produtos.json");

class ProdutosModel {
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
    const produtos = await this.select();
    return produtos.find((produto) => produto.id === id);
  }

  async selectByName(nome) {
    const produtos = await this.select();

    return produtos.find((produto) => produto?.nome?.trim()?.toLowerCase() === nome?.trim()?.toLowerCase()) || null;
  }

  async create(produto) {
    const produtos = await this.select();
    produtos.push(produto);
    const json = JSON.stringify(produtos, null, 2);
    await fs.writeFile(this.file, json, "utf8");
    return produto;
  }

  async update(id, produto) {
    const produtos = await this.select();
    const updatedProdutoIndex = produtos.findIndex((produto) => produto.id === id);

    if (updatedProdutoIndex === -1) return null;

    produtos[updatedProdutoIndex] = {
      ...produtos[updatedProdutoIndex],
      ...produto,
    };

    await fs.writeFile(this.file, JSON.stringify(produtos, null, 2), "utf8");
    return produtos[updatedProdutoIndex];
  }

  async delete(id) {
    const produtos = await this.select();
    const deletedProdutoIndex = produtos.findIndex((produto) => produto.id === id);

    if (deletedProdutoIndex === -1) return null;

    produtos.splice(deletedProdutoIndex, 1);
    await fs.writeFile(this.file, JSON.stringify(produtos, null, 2), "utf8");
    return true;
  }
}

module.exports = ProdutosModel;
