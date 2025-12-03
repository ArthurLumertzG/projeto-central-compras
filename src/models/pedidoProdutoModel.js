const PedidoProduto = require("./schemas/PedidoProduto");
const transformDocument = require("./helpers/transformDocument");

class PedidoProdutoModel {
  async selectByPedidoId(pedido_id) {
    try {
      const result = await PedidoProduto.find({ pedido_id, deletado_em: null }).populate("produto_id", "nome categoria").lean();

      const items = result.map((item) => {
        let valorUnitario = item.valor_unitario;
        if (valorUnitario && typeof valorUnitario === "object" && valorUnitario.$numberDecimal) {
          valorUnitario = parseFloat(valorUnitario.$numberDecimal);
        } else if (valorUnitario && typeof valorUnitario === "object" && valorUnitario.toString) {
          valorUnitario = parseFloat(valorUnitario.toString());
        }

        const transformed = {
          id: item._id.toString(),
          pedido_id: item.pedido_id.toString(),
          produto_id: item.produto_id?.id || item.produto_id?._id?.toString(),
          quantidade: item.quantidade,
          valor_unitario: valorUnitario,
          produto_nome: item.produto_id?.nome,
          produto_categoria: item.produto_id?.categoria,
          criado_em: item.criado_em,
          atualizado_em: item.atualizado_em,
        };
        return transformed;
      });

      return items;
    } catch (error) {
      console.error("Erro ao buscar itens do pedido:", error);
      throw error;
    }
  }

  async create(item) {
    try {
      const novoItem = new PedidoProduto(item);
      const saved = await novoItem.save();
      return transformDocument(saved);
    } catch (error) {
      console.error("Erro ao criar item do pedido:", error);
      throw error;
    }
  }

  async delete(pedido_id) {
    try {
      await PedidoProduto.updateMany({ pedido_id, deletado_em: null }, { deletado_em: new Date() });
      return true;
    } catch (error) {
      console.error("Erro ao deletar itens do pedido:", error);
      throw error;
    }
  }
}

module.exports = PedidoProdutoModel;
