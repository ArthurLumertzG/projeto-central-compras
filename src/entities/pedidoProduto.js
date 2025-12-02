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

  toPublic() {
    const { deletado_em, ...publicData } = this;
    return publicData;
  }

  isDeletado() {
    return this.deletado_em !== null;
  }

  calcularValorTotal() {
    return this.quantidade * this.valor_unitario;
  }

  formatarValorUnitario() {
    return `R$ ${this.valor_unitario.toFixed(2).replace(".", ",")}`;
  }

  formatarValorTotal() {
    return `R$ ${this.calcularValorTotal().toFixed(2).replace(".", ",")}`;
  }
}

module.exports = PedidoProduto;
