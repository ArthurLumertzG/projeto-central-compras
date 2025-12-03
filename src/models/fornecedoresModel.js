const Fornecedor = require("./schemas/Fornecedor");
const transformDocument = require("./helpers/transformDocument");

class FornecedoresModel {
  async select() {
    try {
      const result = await Fornecedor.find({ deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const result = await Fornecedor.findOne({ _id: id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar fornecedor por ID:", error);
      throw error;
    }
  }

  async selectByCnpj(cnpj) {
    try {
      const result = await Fornecedor.findOne({ cnpj, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar fornecedor por CNPJ:", error);
      throw error;
    }
  }

  async selectByUsuarioId(usuario_id) {
    try {
      const result = await Fornecedor.findOne({ usuario_id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar fornecedor por usuário:", error);
      throw error;
    }
  }

  async create(fornecedor) {
    try {
      const novoFornecedor = new Fornecedor(fornecedor);
      const saved = await novoFornecedor.save();
      return transformDocument(saved);
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
      throw error;
    }
  }

  async update(id, fornecedor) {
    try {
      const updated = await Fornecedor.findOneAndUpdate({ _id: id, deletado_em: null }, fornecedor, {
        new: true,
        runValidators: true,
      });
      return transformDocument(updated);
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await Fornecedor.findOneAndUpdate({ _id: id, deletado_em: null }, { deletado_em: new Date() }, { new: true });
      return !!deleted;
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      throw error;
    }
  }
}

module.exports = FornecedoresModel;
