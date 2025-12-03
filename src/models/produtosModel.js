const Produto = require("./schemas/Produto");
const transformDocument = require("./helpers/transformDocument");

class ProdutosModel {
  async select() {
    try {
      const result = await Produto.find({ deletado_em: null }).sort({ nome: 1 });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const result = await Produto.findOne({ _id: id, deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar produto por ID:", error);
      throw error;
    }
  }

  async selectByName(nome) {
    try {
      const result = await Produto.findOne({ nome: new RegExp(`^${nome}$`, "i"), deletado_em: null });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar produto por nome:", error);
      throw error;
    }
  }

  async selectByFornecedor(fornecedor_id) {
    try {
      const result = await Produto.find({ fornecedor_id, deletado_em: null }).sort({ nome: 1 });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar produtos por fornecedor:", error);
      throw error;
    }
  }

  async create(produto) {
    try {
      const novoProduto = new Produto(produto);
      const saved = await novoProduto.save();
      return transformDocument(saved);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  }

  async update(id, produto) {
    try {
      const updated = await Produto.findOneAndUpdate({ _id: id, deletado_em: null }, produto, {
        new: true,
        runValidators: true,
      });
      return transformDocument(updated);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await Produto.findOneAndUpdate({ _id: id, deletado_em: null }, { deletado_em: new Date() }, { new: true });
      return !!deleted;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  }

  async updateEstoque(id, quantidade) {
    try {
      const produto = await Produto.findOne({ _id: id, deletado_em: null });
      if (!produto) {
        throw new Error("Produto não encontrado");
      }

      const novaQuantidade = produto.quantidade_estoque + quantidade;
      if (novaQuantidade < 0) {
        throw new Error("Estoque insuficiente");
      }

      const updated = await Produto.findOneAndUpdate({ _id: id, deletado_em: null }, { quantidade_estoque: novaQuantidade }, { new: true, runValidators: true });

      return transformDocument(updated);
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      throw error;
    }
  }
}

module.exports = ProdutosModel;
