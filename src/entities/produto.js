/**
 * @class Produto
 * @description Representa um produto no sistema de central de compras
 *
 * @property {string} id - UUID do produto (gerado automaticamente)
 * @property {string} nome - Nome do produto (2-200 caracteres)
 * @property {string} descricao - Descrição detalhada do produto (10-1000 caracteres)
 * @property {number} valor_unitario - Valor unitário do produto (sempre positivo, 2 casas decimais)
 * @property {number} quantidade_estoque - Quantidade disponível em estoque (inteiro não-negativo)
 * @property {string} fornecedor_id - UUID do fornecedor associado
 * @property {string} categoria - Categoria do produto (2-100 caracteres)
 * @property {string|null} imagem_url - URL da imagem do produto (opcional)
 * @property {Date} criado_em - Data de criação do registro
 * @property {Date} atualizado_em - Data da última atualização
 * @property {Date|null} deletado_em - Data de exclusão lógica (soft delete), null se ativo
 */
class Produto {
  /**
   * Cria uma nova instância de Produto
   *
   * @param {string} id - UUID único do produto
   * @param {string} nome - Nome do produto
   * @param {string} descricao - Descrição do produto
   * @param {number} valor_unitario - Valor unitário
   * @param {number} quantidade_estoque - Quantidade em estoque
   * @param {string} fornecedor_id - UUID do fornecedor
   * @param {string} categoria - Categoria do produto
   * @param {string|null} imagem_url - URL da imagem do produto
   * @param {Date} criado_em - Data de criação
   * @param {Date} atualizado_em - Data de atualização
   * @param {Date|null} deletado_em - Data de exclusão (null se ativo)
   */
  constructor(id, nome, descricao, valor_unitario, quantidade_estoque, fornecedor_id, categoria, imagem_url, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.valor_unitario = valor_unitario;
    this.quantidade_estoque = quantidade_estoque;
    this.fornecedor_id = fornecedor_id;
    this.categoria = categoria;
    this.imagem_url = imagem_url;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }

  /**
   * Retorna uma representação pública do produto
   * Remove campos internos se necessário
   *
   * @returns {Object} Dados públicos do produto
   */
  toPublic() {
    const { ...publicData } = this;
    return publicData;
  }

  /**
   * Verifica se o produto foi deletado (soft delete)
   *
   * @returns {boolean} true se deletado, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }

  /**
   * Verifica se o produto está com estoque disponível
   *
   * @returns {boolean} true se tem estoque, false caso contrário
   */
  temEstoque() {
    return this.quantidade_estoque > 0;
  }

  /**
   * Calcula o valor total considerando a quantidade em estoque
   *
   * @returns {number} Valor total (valor_unitario * quantidade_estoque)
   */
  calcularValorTotal() {
    return parseFloat((this.valor_unitario * this.quantidade_estoque).toFixed(2));
  }
}

module.exports = Produto;
