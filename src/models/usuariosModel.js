const Usuario = require("./schemas/Usuario");
const transformDocument = require("./helpers/transformDocument");

class UsuariosModel {
  async select() {
    try {
      const usuarios = await Usuario.find({ deletado_em: null }).sort({ nome: 1 });
      return transformDocument(usuarios);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const usuario = await Usuario.findOne({ _id: id, deletado_em: null });
      return transformDocument(usuario);
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw error;
    }
  }

  async selectByEmail(email) {
    try {
      const usuario = await Usuario.findOne({ email, deletado_em: null });
      return transformDocument(usuario);
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw error;
    }
  }

  async create(usuario) {
    try {
      const novoUsuario = new Usuario(usuario);
      const saved = await novoUsuario.save();
      return transformDocument(saved);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }

  async update(id, usuario) {
    try {
      const updated = await Usuario.findOneAndUpdate({ _id: id, deletado_em: null }, usuario, {
        new: true,
        runValidators: true,
      });
      return transformDocument(updated);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await Usuario.findOneAndUpdate({ _id: id, deletado_em: null }, { deletado_em: new Date() }, { new: true });
      return !!deleted;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }
}

module.exports = UsuariosModel;
