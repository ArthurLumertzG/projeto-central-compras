const CondicaoComercial = require("./schemas/CondicaoComercial");
const transformDocument = require("./helpers/transformDocument");

class CondicaoComercialModel {
  async selectByFornecedor(fornecedor_id) {
    try {
      const result = await CondicaoComercial.find({ fornecedor_id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar condições comerciais:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const result = await CondicaoComercial.findOne({ _id: id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar condição comercial por ID:", error);
      throw error;
    }
  }

  async selectByUf(fornecedor_id, uf) {
    try {
      const result = await CondicaoComercial.findOne({ fornecedor_id, uf, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar condição comercial por UF:", error);
      throw error;
    }
  }

  async create(condicao) {
    try {
      const novaCondicao = new CondicaoComercial(condicao);
      const saved = await novaCondicao.save();
      return transformDocument(saved);
    } catch (error) {
      console.error("Erro ao criar condição comercial:", error);
      throw error;
    }
  }

  async update(id, condicao) {
    try {
      const updated = await CondicaoComercial.findOneAndUpdate({ _id: id, deletado_em: null }, condicao, {
        new: true,
        runValidators: true,
      });
      return transformDocument(updated);
    } catch (error) {
      console.error("Erro ao atualizar condição comercial:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await CondicaoComercial.findOneAndUpdate({ _id: id, deletado_em: null }, { deletado_em: new Date() }, { new: true });
      return !!deleted;
    } catch (error) {
      console.error("Erro ao deletar condição comercial:", error);
      throw error;
    }
  }
}

module.exports = CondicaoComercialModel;
