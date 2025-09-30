const fs = require("fs").promises;
const path = require("path");

const dataFile = path.join(__dirname, "../../db/stores.json");

class StoresModel {
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
    const stores = await this.select();
    return stores.find((store) => store.id === id);
  }

  async selectByEmail(email) {
    const stores = await this.select();
    return stores.find((store) => store.email === email);
  }

  async create(store) {
    const stores = await this.select();
    stores.push(store);
    const json = JSON.stringify(stores, null, 2);
    await fs.writeFile(this.file, json, "utf8");
    return store;
  }

  async update(id, store) {
    const stores = await this.select();
    const updatedStoreIndex = stores.findIndex((store) => store.id === id);

    if (updatedStoreIndex === -1) return null;

    stores[updatedStoreIndex] = { ...stores[updatedStoreIndex], ...store };

    await fs.writeFile(this.file, JSON.stringify(stores, null, 2), "utf8");
    return stores[updatedStoreIndex];
  }

  async delete(id) {
    const stores = await this.select();
    const deletedStoreIndex = stores.findIndex((store) => store.id === id);

    if (deletedStoreIndex === -1) return null;

    stores.splice(deletedStoreIndex, 1);
    await fs.writeFile(this.file, JSON.stringify(stores, null, 2), "utf8");
    return true;
  }
}

module.exports = StoresModel;
