/**
 * Entidade que representa a relação N:N entre Pedido e Produto
 * Tabela associativa que armazena os itens de cada pedido
 * @class PedidoProduto
 */
class PedidoProduto {
  /**
   * Cria uma instância de PedidoProduto
   * @param {string} id - UUID do item
   * @param {string} pedido_id - UUID do pedido
   * @param {string} produto_id - UUID do produto
   * @param {number} quantidade - Quantidade do produto no pedido (inteiro positivo)
   * @param {number} valor_unitario - Valor unitário do produto no momento da compra
   * @param {Date} criado_em - Data de criação do registro
   * @param {Date} atualizado_em - Data da última atualização
   * @param {Date|null} deletado_em - Data de exclusão (soft delete)
   */
  constructor(id, pedido_id, produto_id, quantidade, valor_unitario, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.pedido_id = pedido_id;
    this.produto_id = produto_id;
    this.quantidade = quantidade;
    this.valor_unitario = valor_unitario;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }

  /**
   * Retorna os dados públicos do item (sem deletado_em)
   * @returns {Object} Dados públicos do item
   */
  toPublic() {
    const { deletado_em, ...publicData } = this;
    return publicData;
  }

  /**
   * Verifica se o item foi deletado (soft delete)
   * @returns {boolean} true se foi deletado, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }

  /**
   * Calcula o valor total do item (quantidade * valor_unitario)
   * @returns {number} Valor total do item
   */
  calcularValorTotal() {
    return this.quantidade * this.valor_unitario;
  }

  /**
   * Formata o valor unitário para exibição (R$ XX,XX)
   * @returns {string} Valor formatado
   */
  formatarValorUnitario() {
    return `R$ ${this.valor_unitario.toFixed(2).replace(".", ",")}`;
  }

  /**
   * Formata o valor total para exibição (R$ XX,XX)
   * @returns {string} Valor total formatado
   */
  formatarValorTotal() {
    return `R$ ${this.calcularValorTotal().toFixed(2).replace(".", ",")}`;
  }
}

module.exports = PedidoProduto;
