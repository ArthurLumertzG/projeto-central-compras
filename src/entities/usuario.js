class Usuario {
  constructor(id, nome, sobrenome, senha, email, email_verificado, telefone, funcao, endereco_id, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.senha = senha;
    this.email = email;
    this.email_verificado = email_verificado;
    this.telefone = telefone;
    this.funcao = funcao;
    this.endereco_id = endereco_id;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }

  toPublic() {
    const { senha, ...publicData } = this;
    return publicData;
  }

  isDeletado() {
    return this.deletado_em !== null;
  }

  isEmailVerificado() {
    return this.email_verificado === true;
  }
}

module.exports = Usuario;
