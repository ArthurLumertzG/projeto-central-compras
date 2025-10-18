/**
 * Classe que representa um Usuário no sistema
 * Corresponde à tabela 'usuarios' no banco de dados
 */
class Usuario {
  /**
   * @param {string} id - ID único do usuário (UUID)
   * @param {string} nome - Nome do usuário
   * @param {string} sobrenome - Sobrenome do usuário
   * @param {string} senha - Senha hasheada do usuário (bcrypt)
   * @param {string} email - Email do usuário (lowercase)
   * @param {boolean} email_verificado - Indica se o email foi verificado
   * @param {string} telefone - Telefone do usuário no formato internacional
   * @param {string} funcao - Função/cargo do usuário
   * @param {string} endereco_id - ID do endereço associado (FK para tabela enderecos)
   * @param {Date} criado_em - Data de criação do registro
   * @param {Date} atualizado_em - Data da última atualização
   * @param {Date} deletado_em - Data de deleção (soft delete)
   */
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

  /**
   * Retorna os dados do usuário sem a senha (para respostas da API)
   * @returns {Object} Dados do usuário sem senha
   */
  toPublic() {
    const { senha, ...publicData } = this;
    return publicData;
  }

  /**
   * Verifica se o usuário foi deletado (soft delete)
   * @returns {boolean} true se deletado, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }

  /**
   * Verifica se o email do usuário foi verificado
   * @returns {boolean} true se verificado, false caso contrário
   */
  isEmailVerificado() {
    return this.email_verificado === true;
  }
}

module.exports = Usuario;
