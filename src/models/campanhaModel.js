const CampanhaPromocional = require("./schemas/CampanhaPromocional");
const transformDocument = require("./helpers/transformDocument");

class CampanhaModel {
  async select() {
    try {
      const result = await CampanhaPromocional.find({ deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const result = await CampanhaPromocional.findOne({ _id: id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar campanha por ID:", error);
      throw error;
    }
  }

  async selectByFornecedor(fornecedor_id) {
    try {
      const result = await CampanhaPromocional.find({ fornecedor_id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar campanhas por fornecedor:", error);
      throw error;
    }
  }

  async selectByStatus(status) {
    try {
      const result = await CampanhaPromocional.find({ status, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar campanhas por status:", error);
      throw error;
    }
  }

  async selectByNome(nome) {
    try {
      const result = await CampanhaPromocional.findOne({ nome: new RegExp(`^${nome}$`, "i"), deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar campanha por nome:", error);
      throw error;
    }
  }

  async create(campanha) {
    try {
      const novaCampanha = new CampanhaPromocional(campanha);
      const saved = await novaCampanha.save();
      return transformDocument(saved);
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      throw error;
    }
  }

  async update(id, campanha) {
    try {
      const updated = await CampanhaPromocional.findOneAndUpdate({ _id: id, deletado_em: null }, campanha, {
        new: true,
        runValidators: true,
      });
      return transformDocument(updated);
    } catch (error) {
      console.error("Erro ao atualizar campanha:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await CampanhaPromocional.findOneAndUpdate({ _id: id, deletado_em: null }, { deletado_em: new Date() }, { new: true });
      return !!deleted;
    } catch (error) {
      console.error("Erro ao deletar campanha:", error);
      throw error;
    }
  }
}

module.exports = CampanhaModel;
