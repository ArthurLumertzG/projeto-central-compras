class CondicaoComercial {
  constructor(id, uf, cashback_porcentagem, prazo_extendido_dias, variacao_unitario, criado_em, atualizado_em, deletado_em, fornecedor_id) {
    this.id = id;
    this.uf = uf;
    this.cashback_porcentagem = cashback_porcentagem;
    this.prazo_extendido_dias = prazo_extendido_dias;
    this.variacao_unitario = variacao_unitario;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
    this.fornecedor_id = fornecedor_id;
  }

  toPublic() {
    const { deletado_em, ...publicData } = this;
    return publicData;
  }

  isDeletado() {
    return this.deletado_em !== null;
  }
}

module.exports = CondicaoComercial;
