class Endereco {
  constructor(id, estado, cidade, bairro, rua, numero, cep, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.estado = estado;
    this.cidade = cidade;
    this.bairro = bairro;
    this.rua = rua;
    this.numero = numero;
    this.cep = cep;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }
}

module.exports = Endereco;
