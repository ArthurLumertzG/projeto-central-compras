/**
 * Entidade que representa a relação N:N entre Loja e Fornecedor
 * Tabela associativa que define quais fornecedores atendem cada loja
 * @class LojaFornecedor
 */
class LojaFornecedor {
  /**
   * Cria uma instância de LojaFornecedor
   * @param {string} loja_id - UUID da loja
   * @param {string} fornecedor_id - UUID do fornecedor
   * @param {Date} criado_em - Data de criação do vínculo
   * @param {Date} atualizado_em - Data da última atualização
   * @param {Date|null} deletado_em - Data de exclusão (soft delete)
   */
  constructor(loja_id, fornecedor_id, criado_em, atualizado_em, deletado_em) {
    this.loja_id = loja_id;
    this.fornecedor_id = fornecedor_id;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }

  /**
   * Retorna os dados públicos do vínculo (sem deletado_em)
   * @returns {Object} Dados públicos do vínculo
   */
  toPublic() {
    const { deletado_em, ...publicData } = this;
    return publicData;
  }

  /**
   * Verifica se o vínculo foi deletado (soft delete)
   * @returns {boolean} true se foi deletado, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }

  /**
   * Verifica se o vínculo está ativo
   * @returns {boolean} true se está ativo (não deletado)
   */
  isAtivo() {
    return !this.isDeletado();
  }
}

module.exports = LojaFornecedor;
