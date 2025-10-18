class Loja {
  constructor(id, nome, cnpj, usuario_id, endereco_id, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.nome = nome;
    this.cnpj = cnpj;
    this.usuario_id = usuario_id;
    this.endereco_id = endereco_id;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }
}

module.exports = Loja;
