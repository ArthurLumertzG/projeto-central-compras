const fs = require("fs").promises;
const path = require("path");

const dataFile = path.join(__dirname, "../../db/fornecedores.json");

class FornecedoresModel {
  constructor() {
    this.file = dataFile;
  }

  select() {
    return "get all";
  }

  async create(fornecedor) {
    const json = JSON.stringify(fornecedor, null, 2);
    await fs.writeFile(this.file, json, "utf8");
  }
}

module.exports = FornecedoresModel;
