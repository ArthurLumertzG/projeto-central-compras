class PedidoProduto {
  constructor(id, pedido_id, produto_id, quantidade, valor_unitario, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.pedido_id = pedido_id;
    this.produto_id = produto_id;
    this.quantidade = quantidade;
    this.valor_unitario = valor_unitario;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }
}

module.exports = PedidoProduto;
