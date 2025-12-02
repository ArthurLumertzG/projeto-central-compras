/**
 * Entidade que representa uma Condição Comercial no sistema
 * @class CondicaoComercial
 */
class CondicaoComercial {
  /**
   * Cria uma instância de CondicaoComercial
   * @param {string} id - UUID da condição comercial
   * @param {string} uf - Sigla do estado (UF)
   * @param {number} cashback_porcentagem - Percentual de cashback (0-100)
   * @param {number} prazo_extendido_dias - Prazo extendido em dias
   * @param {number} variacao_unitario - Variação do preço unitário
   * @param {Date} criado_em - Data de criação
   * @param {Date} atualizado_em - Data da última atualização
   * @param {Date|null} deletado_em - Data de exclusão (soft delete)
   * @param {string} fornecedor_id - UUID do fornecedor
   */
  constructor(id, uf, cashback_porcentagem, prazo_extendido_dias, variacao_unitario, criado_em, atualizado_em, deletado_em, fornecedor_id) {
    this.id = id;
    this.uf = uf;
    this.cashback_porcentagem = cashback_porcentagem;
    this.prazo_extendido_dias = prazo_extendido_dias;
    this.variacao_unitario = variacao_unitario;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
    this.fornecedor_id = fornecedor_id;
  }

  /**
   * Retorna os dados públicos da condição comercial (sem deletado_em)
   * @returns {Object} Dados públicos da condição comercial
   */
  toPublic() {
    const { deletado_em, ...publicData } = this;
    return publicData;
  }

  /**
   * Verifica se a condição comercial foi deletada (soft delete)
   * @returns {boolean} true se foi deletada, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }
}

module.exports = CondicaoComercial;
