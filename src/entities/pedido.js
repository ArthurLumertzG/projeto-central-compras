class Pedido {
  constructor(id, valor_total, descricao, usuario_id, loja_id, status, forma_pagamento, prazo_dias, criado_em, enviado_em, entregue_em, deletado_em) {
    this.id = id;
    this.valor_total = valor_total;
    this.descricao = descricao;
    this.usuario_id = usuario_id;
    this.loja_id = loja_id;
    this.status = status;
    this.forma_pagamento = forma_pagamento;
    this.prazo_dias = prazo_dias;
    this.criado_em = criado_em;
    this.enviado_em = enviado_em;
    this.entregue_em = entregue_em;
    this.deletado_em = deletado_em;
  }

  toPublic() {
    const { deletado_em, ...publicData } = this;
    return publicData;
  }

  isDeletado() {
    return this.deletado_em !== null;
  }

  isPendente() {
    return this.status === "pendente" && !this.isDeletado();
  }

  isEnviado() {
    return this.status === "enviado" && !this.isDeletado();
  }

  isEntregue() {
    return this.status === "entregue" && !this.isDeletado();
  }

  isCancelado() {
    return this.status === "cancelado";
  }

  podeEditar() {
    return this.status === "pendente" && !this.isDeletado();
  }

  podeCancelar() {
    return !["entregue", "cancelado"].includes(this.status) && !this.isDeletado();
  }

  calcularDataPrevistaEntrega() {
    const dataBase = this.enviado_em || this.criado_em;
    const dataPrevista = new Date(dataBase);
    dataPrevista.setDate(dataPrevista.getDate() + this.prazo_dias);
    return dataPrevista;
  }
}

module.exports = Pedido;
