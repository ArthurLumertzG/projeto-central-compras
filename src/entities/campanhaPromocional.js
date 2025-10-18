class CampanhaPromocional {
  constructor(id, nome, descricao, valor_min, quantidade_min, desconto_porcentagem, status, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.valor_min = valor_min;
    this.quantidade_min = quantidade_min;
    this.desconto_porcentagem = desconto_porcentagem;
    this.status = status;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }
}

module.exports = CampanhaPromocional;
