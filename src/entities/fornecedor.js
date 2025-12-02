class Fornecedor {
  constructor(id, cnpj, razao_social, nome_fantasia, descricao, usuario_id, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.cnpj = cnpj;
    this.razao_social = razao_social;
    this.nome_fantasia = nome_fantasia;
    this.descricao = descricao;
    this.usuario_id = usuario_id;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }

  toPublic() {
    return {
      id: this.id,
      cnpj: this.cnpj,
      razao_social: this.razao_social,
      nome_fantasia: this.nome_fantasia,
      descricao: this.descricao,
      usuario_id: this.usuario_id,
      criado_em: this.criado_em,
      atualizado_em: this.atualizado_em,
    };
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

module.exports = Fornecedor;
