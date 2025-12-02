class Endereco {
  constructor(id, estado, cidade, bairro, rua, numero, complemento, cep, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.estado = estado;
    this.cidade = cidade;
    this.bairro = bairro;
    this.rua = rua;
    this.numero = numero;
    this.complemento = complemento;
    this.cep = cep;
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

  formatarCompleto() {
    const complementoPart = this.complemento ? `, ${this.complemento}` : "";
    return `${this.rua}, ${this.numero}${complementoPart} - ${this.bairro} - ${this.cidade}/${this.estado} - CEP: ${this.cep}`;
  }

  getCepSemFormatacao() {
    return this.cep.replace("-", "");
  }
}

module.exports = Endereco;
