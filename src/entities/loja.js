/**
 * @class Loja
 * @description Representa uma loja no sistema de central de compras
 *
 * @property {string} id - UUID da loja (gerado automaticamente)
 * @property {string} nome - Nome da loja (2-200 caracteres)
 * @property {string} cnpj - CNPJ da loja (14 dígitos, único no sistema)
 * @property {string} usuario_id - UUID do usuário responsável pela loja
 * @property {string|null} endereco_id - UUID do endereço da loja (opcional)
 * @property {Date} criado_em - Data de criação do registro
 * @property {Date} atualizado_em - Data da última atualização
 * @property {Date|null} deletado_em - Data de exclusão lógica (soft delete), null se ativo
 */
class Loja {
  /**
   * Cria uma nova instância de Loja
   *
   * @param {string} id - UUID único da loja
   * @param {string} nome - Nome da loja
   * @param {string} cnpj - CNPJ (14 dígitos)
   * @param {string} usuario_id - UUID do usuário responsável
   * @param {string|null} endereco_id - UUID do endereço (opcional)
   * @param {Date} criado_em - Data de criação
   * @param {Date} atualizado_em - Data de atualização
   * @param {Date|null} deletado_em - Data de exclusão (null se ativo)
   */
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

  /**
   * Retorna uma representação pública da loja
   * Remove campos internos se necessário
   *
   * @returns {Object} Dados públicos da loja
   */
  toPublic() {
    const { ...publicData } = this;
    return publicData;
  }

  /**
   * Verifica se a loja foi deletada (soft delete)
   *
   * @returns {boolean} true se deletado, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }

  /**
   * Formata o CNPJ para exibição (00.000.000/0000-00)
   *
   * @returns {string} CNPJ formatado
   * @example "12.345.678/0001-90"
   */
  formatarCNPJ() {
    if (!this.cnpj || this.cnpj.length !== 14) {
      return this.cnpj;
    }
    return this.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }

  /**
   * Valida se o CNPJ tem o formato correto (apenas dígitos, 14 caracteres)
   * Nota: Esta é uma validação básica de formato, não verifica dígitos verificadores
   *
   * @returns {boolean} true se válido, false caso contrário
   */
  isCNPJValido() {
    return /^\d{14}$/.test(this.cnpj);
  }
}

module.exports = Loja;
