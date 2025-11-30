/**
 * Entidade que representa um Pedido no sistema
 * @class Pedido
 */
class Pedido {
  /**
   * Cria uma instância de Pedido
   * @param {string} id - UUID do pedido
   * @param {number} valor_total - Valor total do pedido (calculado automaticamente)
   * @param {string|null} descricao - Descrição/observações do pedido (5-500 caracteres)
   * @param {string} usuario_id - UUID do usuário que criou o pedido
   * @param {string} loja_id - UUID da loja que receberá o pedido
   * @param {string} status - Status do pedido (pendente, enviado, entregue, cancelado)
   * @param {string} forma_pagamento - Forma de pagamento (dinheiro, cartao_credito, cartao_debito, pix, boleto)
   * @param {number} prazo_dias - Prazo de entrega em dias (1-365)
   * @param {Date} criado_em - Data de criação do pedido
   * @param {Date|null} enviado_em - Data de envio do pedido
   * @param {Date|null} entregue_em - Data de entrega do pedido
   * @param {Date|null} deletado_em - Data de exclusão (soft delete)
   */
  constructor(id, valor_total, descricao, usuario_id, loja_id, status, forma_pagamento, prazo_dias, criado_em, enviado_em, entregue_em, deletado_em) {
    this.id = id;
    this.valor_total = valor_total;
    this.descricao = descricao;
    this.usuario_id = usuario_id;
    this.loja_id = loja_id;
    this.status = status;
    this.forma_pagamento = forma_pagamento;
    this.prazo_dias = prazo_dias;
    this.criado_em = criado_em;
    this.enviado_em = enviado_em;
    this.entregue_em = entregue_em;
    this.deletado_em = deletado_em;
  }

  /**
   * Retorna os dados públicos do pedido (sem deletado_em)
   * @returns {Object} Dados públicos do pedido
   */
  toPublic() {
    const { deletado_em, ...publicData } = this;
    return publicData;
  }

  /**
   * Verifica se o pedido foi deletado (soft delete)
   * @returns {boolean} true se foi deletado, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }

  /**
   * Verifica se o pedido está pendente
   * @returns {boolean} true se está pendente, false caso contrário
   */
  isPendente() {
    return this.status === "pendente" && !this.isDeletado();
  }

  /**
   * Verifica se o pedido foi enviado
   * @returns {boolean} true se foi enviado, false caso contrário
   */
  isEnviado() {
    return this.status === "enviado" && !this.isDeletado();
  }

  /**
   * Verifica se o pedido foi entregue
   * @returns {boolean} true se foi entregue, false caso contrário
   */
  isEntregue() {
    return this.status === "entregue" && !this.isDeletado();
  }

  /**
   * Verifica se o pedido foi cancelado
   * @returns {boolean} true se foi cancelado, false caso contrário
   */
  isCancelado() {
    return this.status === "cancelado";
  }

  /**
   * Verifica se o pedido pode ser editado
   * @returns {boolean} true se pode ser editado (status pendente)
   */
  podeEditar() {
    return this.status === "pendente" && !this.isDeletado();
  }

  /**
   * Verifica se o pedido pode ser cancelado
   * @returns {boolean} true se pode ser cancelado (não está entregue nem cancelado)
   */
  podeCancelar() {
    return !["entregue", "cancelado"].includes(this.status) && !this.isDeletado();
  }

  /**
   * Calcula a data prevista de entrega
   * @returns {Date} Data prevista de entrega
   */
  calcularDataPrevistaEntrega() {
    const dataBase = this.enviado_em || this.criado_em;
    const dataPrevista = new Date(dataBase);
    dataPrevista.setDate(dataPrevista.getDate() + this.prazo_dias);
    return dataPrevista;
  }
}

module.exports = Pedido;
