/**
 * @class Endereco
 * @description Representa um endereço no sistema
 *
 * @property {string} id - UUID do endereço (gerado automaticamente)
 * @property {string} estado - Sigla do estado (2 caracteres, ex: SP, RJ, MG)
 * @property {string} cidade - Nome da cidade (2-100 caracteres)
 * @property {string} bairro - Nome do bairro (2-100 caracteres)
 * @property {string} rua - Nome da rua/avenida (3-200 caracteres)
 * @property {string} numero - Número do endereço (até 10 caracteres, pode ser "S/N")
 * @property {string|null} complemento - Complemento opcional (até 100 caracteres)
 * @property {string} cep - CEP no formato 12345-678 ou 12345678
 * @property {Date} criado_em - Data de criação do registro
 * @property {Date} atualizado_em - Data da última atualização
 * @property {Date|null} deletado_em - Data de exclusão lógica (soft delete), null se ativo
 */
class Endereco {
  /**
   * Cria uma nova instância de Endereco
   *
   * @param {string} id - UUID único do endereço
   * @param {string} estado - Sigla do estado (2 caracteres)
   * @param {string} cidade - Nome da cidade
   * @param {string} bairro - Nome do bairro
   * @param {string} rua - Nome da rua
   * @param {string} numero - Número do endereço
   * @param {string|null} complemento - Complemento (opcional)
   * @param {string} cep - CEP
   * @param {Date} criado_em - Data de criação
   * @param {Date} atualizado_em - Data de atualização
   * @param {Date|null} deletado_em - Data de exclusão (null se ativo)
   */
  constructor(id, estado, cidade, bairro, rua, numero, complemento, cep, criado_em, atualizado_em, deletado_em) {
    this.id = id;
    this.estado = estado;
    this.cidade = cidade;
    this.bairro = bairro;
    this.rua = rua;
    this.numero = numero;
    this.complemento = complemento;
    this.cep = cep;
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
    this.deletado_em = deletado_em;
  }

  /**
   * Retorna uma representação pública do endereço
   *
   * @returns {Object} Dados públicos do endereço
   */
  toPublic() {
    const { ...publicData } = this;
    return publicData;
  }

  /**
   * Verifica se o endereço foi deletado (soft delete)
   *
   * @returns {boolean} true se deletado, false caso contrário
   */
  isDeletado() {
    return this.deletado_em !== null;
  }

  /**
   * Retorna o endereço formatado para exibição
   *
   * @returns {string} Endereço completo formatado
   * @example "Rua das Flores, 123, Apto 45 - Centro - São Paulo/SP - CEP: 01234-567"
   */
  formatarCompleto() {
    const complementoPart = this.complemento ? `, ${this.complemento}` : "";
    return `${this.rua}, ${this.numero}${complementoPart} - ${this.bairro} - ${this.cidade}/${this.estado} - CEP: ${this.cep}`;
  }

  /**
   * Normaliza o CEP removendo hífen
   *
   * @returns {string} CEP apenas com números (12345678)
   */
  getCepSemFormatacao() {
    return this.cep.replace("-", "");
  }
}

module.exports = Endereco;
