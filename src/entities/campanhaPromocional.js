class CampanhaPromocional {
  constructor(id, nome, descricao, valor_min, quantidade_min, desconto_porcentagem, status, fornecedor_id, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.valor_min = valor_min;
    this.quantidade_min = quantidade_min;
    this.desconto_porcentagem = desconto_porcentagem;
    this.status = status;
    this.fornecedor_id = fornecedor_id;
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

  isAtiva() {
    return this.status === "ativo" && !this.isDeletado();
  }

  calcularValorComDesconto(valorOriginal) {
    if (!this.isAtiva()) {
      return valorOriginal;
    }
    const desconto = (valorOriginal * this.desconto_porcentagem) / 100;
    return valorOriginal - desconto;
  }

  podeAplicar(valor, quantidade) {
    if (!this.isAtiva()) {
      return false;
    }

    const atendeValorMinimo = this.valor_min === null || valor >= this.valor_min;
    const atendeQuantidadeMinima = this.quantidade_min === null || quantidade >= this.quantidade_min;

    return atendeValorMinimo && atendeQuantidadeMinima;
  }
}

module.exports = CampanhaPromocional;
