const fs = require("fs").promises;
const path = require("path");

const dataFile = path.join(__dirname, "../../db/campanhas.json");

class CampanhasModel {
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
    const campanhas = await this.select();
    return campanhas.find((campanha) => campanha.id === id);
  }

  // Opcional: buscar por nome de campanha
  async selectByNome(nome) {
    const campanhas = await this.select();
    return campanhas.find((campanha) => campanha.nome === nome);
  }

  async create(campanha) {
    const campanhas = await this.select();
    campanhas.push(campanha);
    const json = JSON.stringify(campanhas, null, 2);
    await fs.writeFile(this.file, json, "utf8");
    return campanha;
  }

  async update(id, campanha) {
    const campanhas = await this.select();
    const updatedCampanhaIndex = campanhas.findIndex((c) => c.id === id);

    if (updatedCampanhaIndex === -1) return null;

    campanhas[updatedCampanhaIndex] = {
      ...campanhas[updatedCampanhaIndex],
      ...campanha,
    };

    await fs.writeFile(this.file, JSON.stringify(campanhas, null, 2), "utf8");
    return campanhas[updatedCampanhaIndex];
  }

  async delete(id) {
    const campanhas = await this.select();
    const deletedCampanhaIndex = campanhas.findIndex((c) => c.id === id);

    if (deletedCampanhaIndex === -1) return null;

    campanhas.splice(deletedCampanhaIndex, 1);
    await fs.writeFile(this.file, JSON.stringify(campanhas, null, 2), "utf8");
    return true;
  }
}

module.exports = CampanhasModel;
