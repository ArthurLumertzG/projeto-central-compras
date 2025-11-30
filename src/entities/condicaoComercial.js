class CondicaoComercial {
  constructor(id, estado, cashback_porcentagem, prazo_extendido_dias, variacao_unitario, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.estado = estado;
    this.cashback_porcentagem = cashback_porcentagem;
    this.prazo_extendido_dias = prazo_extendido_dias;
    this.variacao_unitario = variacao_unitario;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }
}

module.exports = CondicaoComercial;
