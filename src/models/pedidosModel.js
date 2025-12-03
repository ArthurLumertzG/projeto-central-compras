const Pedido = require("./schemas/Pedido");
const transformDocument = require("./helpers/transformDocument");

class PedidosModel {
  async select() {
    try {
      const result = await Pedido.find({ deletado_em: null }).populate("loja_id", "nome cnpj").sort({ criado_em: -1 });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const result = await Pedido.findOne({ _id: id, deletado_em: null }).populate("loja_id", "nome cnpj");

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar pedido por ID:", error);
      throw error;
    }
  }

  async selectByUsuarioId(usuario_id) {
    try {
      const result = await Pedido.find({ usuario_id, deletado_em: null }).populate("loja_id", "nome cnpj").sort({ criado_em: -1 });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar pedidos por usuário:", error);
      throw error;
    }
  }

  async selectByFornecedor(fornecedor_id) {
    try {
      const result = await Pedido.find({ fornecedor_id, deletado_em: null }).populate("loja_id", "nome cnpj").sort({ criado_em: -1 });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar pedidos por fornecedor:", error);
      throw error;
    }
  }

  async selectByStatus(status) {
    try {
      const result = await Pedido.find({ status, deletado_em: null }).sort({ criado_em: -1 });

      return transformDocument(result);
    } catch (error) {
      console.error("Erro ao buscar pedidos por status:", error);
      throw error;
    }
  }

  async selectByDate(startDate, endDate) {
    try {
      return await Pedido.find({
        criado_em: { $gte: new Date(startDate), $lte: new Date(endDate) },
        deletado_em: null,
      }).sort({ criado_em: -1 });
    } catch (error) {
      console.error("Erro ao buscar pedidos por data:", error);
      throw error;
    }
  }

  async create(pedido) {
    try {
      const novoPedido = new Pedido(pedido);
      const saved = await novoPedido.save();
      return transformDocument(saved);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    }
  }

  async update(id, pedido) {
    try {
      const updated = await Pedido.findOneAndUpdate({ _id: id, deletado_em: null }, pedido, {
        new: true,
        runValidators: true,
      });
      return transformDocument(updated);
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await Pedido.findOneAndUpdate({ _id: id, deletado_em: null }, { deletado_em: new Date() }, { new: true });
      return !!deleted;
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
      throw error;
    }
  }
}

module.exports = PedidosModel;
