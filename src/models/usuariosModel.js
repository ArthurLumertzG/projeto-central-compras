const fs = require("fs").promises;
const path = require("path");

const dataFile = path.join(__dirname, "../../db/usuarios.json");

class UsuariosModel {
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
    const usuarios = await this.select();
    return usuarios.find((usuario) => usuario.id === id);
  }

  async selectByEmail(email) {
    const usuarios = await this.select();
    return usuarios.find((usuario) => usuario.email === email);
  }

  async create(usuario) {
    const usuarios = await this.select();
    usuarios.push(usuario);
    const json = JSON.stringify(usuarios, null, 2);
    await fs.writeFile(this.file, json, "utf8");
    return usuario;
  }

  async update(id, usuario) {
    const usuarios = await this.select();
    const updatedUsuarioIndex = usuarios.findIndex((usuario) => usuario.id === id);

    if (updatedUsuarioIndex === -1) return null;

    usuarios[updatedUsuarioIndex] = { ...usuarios[updatedUsuarioIndex], ...usuario };

    await fs.writeFile(this.file, JSON.stringify(usuarios, null, 2), "utf8");
    return usuarios[updatedUsuarioIndex];
  }

  async delete(id) {
    const usuarios = await this.select();
    const deletedUsuarioIndex = usuarios.findIndex((usuario) => usuario.id === id);

    if (deletedUsuarioIndex === -1) return null;

    usuarios.splice(deletedUsuarioIndex, 1);
    await fs.writeFile(this.file, JSON.stringify(usuarios, null, 2), "utf8");
    return true;
  }
}

module.exports = UsuariosModel;
