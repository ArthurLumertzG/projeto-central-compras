class Produto {
  constructor(id, nome, descricao, valor_unitario, quantidade_estoque, fornecedor_id, categoria, imagem_url, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.valor_unitario = valor_unitario;
    this.quantidade_estoque = quantidade_estoque;
    this.fornecedor_id = fornecedor_id;
    this.categoria = categoria;
    this.imagem_url = imagem_url;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }

  toPublic() {
    const { ...publicData } = this;
    return publicData;
  }

  isDeletado() {
    return this.deletado_em !== null;
  }

  temEstoque() {
    return this.quantidade_estoque > 0;
  }

  calcularValorTotal() {
    return parseFloat((this.valor_unitario * this.quantidade_estoque).toFixed(2));
  }
}

module.exports = Produto;
