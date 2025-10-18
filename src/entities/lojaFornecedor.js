class LojaFornecedor {
  constructor(loja_id, fornecedor_id, criado_em, atualizado_em, deletado_em) {
    this.loja_id = loja_id;
    this.fornecedor_id = fornecedor_id;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }
}

module.exports = LojaFornecedor;
