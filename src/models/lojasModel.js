const Loja = require("./schemas/Loja");
const transformDocument = require("./helpers/transformDocument");

class LojasModel {
  async select() {
    try {
      const result = await Loja.find({ deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const result = await Loja.findOne({ _id: id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar loja por ID:", error);
      throw error;
    }
  }

  async selectByCnpj(cnpj) {
    try {
      const result = await Loja.findOne({ cnpj, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar loja por CNPJ:", error);
      throw error;
    }
  }

  async selectByUsuarioId(usuario_id) {
    try {
      const result = await Loja.find({ usuario_id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar lojas por usuário:", error);
      throw error;
    }
  }

  async create(loja) {
    try {
      const novaLoja = new Loja(loja);
      const saved = await novaLoja.save();
      return transformDocument(saved);
    } catch (error) {
      console.error("Erro ao criar loja:", error);
      throw error;
    }
  }

  async update(id, loja) {
    try {
      const updated = await Loja.findOneAndUpdate({ _id: id, deletado_em: null }, loja, {
        new: true,
        runValidators: true,
      });
      return transformDocument(updated);
    } catch (error) {
      console.error("Erro ao atualizar loja:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await Loja.findOneAndUpdate({ _id: id, deletado_em: null }, { deletado_em: new Date() }, { new: true });
      return !!deleted;
    } catch (error) {
      console.error("Erro ao deletar loja:", error);
      throw error;
    }
  }
}

module.exports = LojasModel;
