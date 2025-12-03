const Endereco = require("./schemas/Endereco");
const transformDocument = require("./helpers/transformDocument");

class EnderecosModel {
  async select() {
    try {
      const result = await Endereco.find({ deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const result = await Endereco.findOne({ _id: id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar endereço por ID:", error);
      throw error;
    }
  }

  async create(endereco) {
    try {
      const novoEndereco = new Endereco(endereco);
      const saved = await novoEndereco.save();
      return transformDocument(saved);
    } catch (error) {
      console.error("Erro ao criar endereço:", error);
      throw error;
    }
  }

  async update(id, endereco) {
    try {
      const updated = await Endereco.findOneAndUpdate({ _id: id, deletado_em: null }, endereco, {
        new: true,
        runValidators: true,
      });
      return transformDocument(updated);
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await Endereco.findOneAndUpdate({ _id: id, deletado_em: null }, { deletado_em: new Date() }, { new: true });
      return !!deleted;
    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
      throw error;
    }
  }

  async exists(id) {
    try {
      const endereco = await Endereco.findOne({ _id: id, deletado_em: null });
      return !!endereco;
    } catch (error) {
      console.error("Erro ao verificar existência do endereço:", error);
      return false;
    }
  }

  async selectByCep(cep) {
    try {
      const result = await Endereco.find({ cep, deletado_em: null });
      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar endereço por CEP:", error);
      throw error;
    }
  }

  async selectByCidadeEstado(cidade, estado) {
    try {
      const result = await Endereco.find({ cidade, estado, deletado_em: null });
      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar endereço por cidade/estado:", error);
      throw error;
    }
  }
}

module.exports = EnderecosModel;
