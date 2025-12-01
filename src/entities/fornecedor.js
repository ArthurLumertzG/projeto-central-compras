/**
 * @class Fornecedor
 * @description Representa um fornecedor no sistema
 */
class Fornecedor {
  /**
   * @param {string} id - UUID único do fornecedor
   * @param {string} cnpj - CNPJ do fornecedor (14 dígitos)
   * @param {string|null} razao_social - Razão social do fornecedor
   * @param {string|null} nome_fantasia - Nome fantasia do fornecedor
   * @param {string|null} descricao - Descrição do fornecedor (2-500 caracteres)
   * @param {string|null} usuario_id - UUID do usuário responsável
   * @param {Date} criado_em - Data de criação
   * @param {Date} atualizado_em - Data da última atualização
   * @param {Date|null} deletado_em - Data de exclusão (soft delete)
   */
  constructor(id, cnpj, razao_social, nome_fantasia, descricao, usuario_id, criado_em, atualizado_em, deletado_em) {
    /** @type {string} UUID único do fornecedor */
    this.id = id;

    /** @type {string} CNPJ do fornecedor (14 dígitos) */
    this.cnpj = cnpj;

    /** @type {string|null} Razão social do fornecedor */
    this.razao_social = razao_social;

    /** @type {string|null} Nome fantasia do fornecedor */
    this.nome_fantasia = nome_fantasia;

    /** @type {string|null} Descrição do fornecedor */
    this.descricao = descricao;

    /** @type {string|null} UUID do usuário responsável */
    this.usuario_id = usuario_id;

    /** @type {Date} Data de criação */
    this.criado_em = criado_em;

    /** @type {Date} Data da última atualização */
    this.atualizado_em = atualizado_em;

    /** @type {Date|null} Data de exclusão (soft delete) */
    this.deletado_em = deletado_em;
  }

  /**
   * Retorna os dados públicos do fornecedor (sem deletado_em)
   * @returns {Object} Dados públicos do fornecedor
   */
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

  /**
   * Verifica se o fornecedor foi deletado (soft delete)
   * @returns {boolean} true se deletado, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }

  /**
   * Formata o CNPJ no padrão brasileiro
   * @returns {string} CNPJ formatado (XX.XXX.XXX/XXXX-XX)
   * @example "12345678000190" -> "12.345.678/0001-90"
   */
  formatarCNPJ() {
    if (!this.cnpj || this.cnpj.length !== 14) {
      return this.cnpj;
    }
    return this.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }

  /**
   * Valida o formato do CNPJ (14 dígitos)
   * @returns {boolean} true se válido, false caso contrário
   */
  isCNPJValido() {
    return /^\d{14}$/.test(this.cnpj);
  }
}

module.exports = Fornecedor;
