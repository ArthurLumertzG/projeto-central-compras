/**
 * Entidade que representa uma Campanha Promocional no sistema
 * @class CampanhaPromocional
 */
class CampanhaPromocional {
  /**
   * Cria uma instância de CampanhaPromocional
   * @param {string} id - UUID da campanha
   * @param {string} nome - Nome da campanha (3-100 caracteres)
   * @param {string|null} descricao - Descrição da campanha (10-500 caracteres)
   * @param {number|null} valor_min - Valor mínimo para aplicar o desconto
   * @param {number|null} quantidade_min - Quantidade mínima para aplicar o desconto
   * @param {number} desconto_porcentagem - Percentual de desconto (0-100)
   * @param {string} status - Status da campanha (ativa, inativa, expirada)
   * @param {string} fornecedor_id - UUID do fornecedor
   * @param {Date} criado_em - Data de criação
   * @param {Date} atualizado_em - Data da última atualização
   * @param {Date|null} deletado_em - Data de exclusão (soft delete)
   */
  constructor(id, nome, descricao, valor_min, quantidade_min, desconto_porcentagem, status, fornecedor_id, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.valor_min = valor_min;
    this.quantidade_min = quantidade_min;
    this.desconto_porcentagem = desconto_porcentagem;
    this.status = status;
    this.fornecedor_id = fornecedor_id;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }

  /**
   * Retorna os dados públicos da campanha (sem deletado_em)
   * @returns {Object} Dados públicos da campanha
   */
  toPublic() {
    const { deletado_em, ...publicData } = this;
    return publicData;
  }

  /**
   * Verifica se a campanha foi deletada (soft delete)
   * @returns {boolean} true se foi deletada, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }

  /**
   * Verifica se a campanha está ativa
   * @returns {boolean} true se está ativa, false caso contrário
   */
  isAtiva() {
    return this.status === "ativa" && !this.isDeletado();
  }

  /**
   * Calcula o valor com desconto aplicado
   * @param {number} valorOriginal - Valor original do produto
   * @returns {number} Valor com desconto aplicado
   */
  calcularValorComDesconto(valorOriginal) {
    if (!this.isAtiva()) {
      return valorOriginal;
    }
    const desconto = (valorOriginal * this.desconto_porcentagem) / 100;
    return valorOriginal - desconto;
  }

  /**
   * Verifica se a campanha pode ser aplicada dado um valor e quantidade
   * @param {number} valor - Valor total
   * @param {number} quantidade - Quantidade de itens
   * @returns {boolean} true se a campanha pode ser aplicada
   */
  podeAplicar(valor, quantidade) {
    if (!this.isAtiva()) {
      return false;
    }

    const atendeValorMinimo = this.valor_min === null || valor >= this.valor_min;
    const atendeQuantidadeMinima = this.quantidade_min === null || quantidade >= this.quantidade_min;

    return atendeValorMinimo && atendeQuantidadeMinima;
  }
}

module.exports = CampanhaPromocional;
