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

  toPublic() {
    const { ...publicData } = this;
    return publicData;
  }

  isDeletado() {
    return this.deletado_em !== null;
  }

  formatarCNPJ() {
    if (!this.cnpj || this.cnpj.length !== 14) {
      return this.cnpj;
    }
    return this.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }

  isCNPJValido() {
    return /^\d{14}$/.test(this.cnpj);
  }
}

module.exports = Loja;
