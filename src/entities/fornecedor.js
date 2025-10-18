class Fornecedor {
  constructor(id, cnpj, descricao, usuario_id, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.cnpj = cnpj;
    this.descricao = descricao;
    this.usuario_id = usuario_id;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }
}
module.exports = Fornecedor;
