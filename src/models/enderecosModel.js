const database = require("../../db/database");

/**
 * @class EnderecosModel
 * @description Model responsável pelas operações de banco de dados da tabela enderecos
 * Implementa soft delete e queries parametrizadas
 */
class EnderecosModel {
  constructor() {
    this.tableName = "enderecos";
  }

  /**
   * Retorna todos os endereços ativos (não deletados)
   * @returns {Promise<Array>} Lista de endereços
   */
  async select() {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE deletado_em IS NULL ORDER BY criado_em DESC`,
        values: [],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      throw error;
    }
  }

  /**
   * Busca um endereço por ID
   * @param {string} id - UUID do endereço
   * @returns {Promise<Object|null>} Endereço encontrado ou null
   */
  async selectById(id) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE id = $1 AND deletado_em IS NULL`,
        values: [id],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar endereço por ID:", error);
      throw error;
    }
  }

  /**
   * Busca endereços por CEP
   * @param {string} cep - CEP (com ou sem hífen)
   * @returns {Promise<Array>} Lista de endereços com o CEP informado
   */
  async selectByCep(cep) {
    try {
      // Remove hífen do CEP para busca
      const cepSemFormatacao = cep.replace("-", "");

      const query = {
        text: `SELECT * FROM ${this.tableName} 
               WHERE REPLACE(cep, '-', '') = $1 
               AND deletado_em IS NULL 
               ORDER BY criado_em DESC`,
        values: [cepSemFormatacao],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar endereço por CEP:", error);
      throw error;
    }
  }

  /**
   * Busca endereços por cidade e estado
   * @param {string} cidade - Nome da cidade
   * @param {string} estado - Sigla do estado (2 caracteres)
   * @returns {Promise<Array>} Lista de endereços
   */
  async selectByCidadeEstado(cidade, estado) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} 
               WHERE LOWER(cidade) = LOWER($1) 
               AND UPPER(estado) = UPPER($2) 
               AND deletado_em IS NULL 
               ORDER BY bairro, rua`,
        values: [cidade, estado],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar endereços por cidade/estado:", error);
      throw error;
    }
  }

  /**
   * Cria um novo endereço
   * @param {Object} endereco - Dados do endereço
   * @returns {Promise<Object>} Endereço criado
   */
  async create(endereco) {
    try {
      const query = {
        text: `INSERT INTO ${this.tableName} 
               (id, estado, cidade, bairro, rua, numero, complemento, cep, criado_em, atualizado_em) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
               RETURNING *`,
        values: [endereco.id, endereco.estado, endereco.cidade, endereco.bairro, endereco.rua, endereco.numero, endereco.complemento || null, endereco.cep, endereco.criado_em, endereco.atualizado_em],
      };
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar endereço:", error);
      throw error;
    }
  }

  /**
   * Atualiza um endereço existente
   * @param {string} id - UUID do endereço
   * @param {Object} endereco - Dados para atualização
   * @returns {Promise<Object|null>} Endereço atualizado ou null se não encontrado
   */
  async update(id, endereco) {
    try {
      const fields = Object.keys(endereco);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(", ");
      const values = [id, ...Object.values(endereco)];

      const query = {
        text: `UPDATE ${this.tableName} 
               SET ${setClause} 
               WHERE id = $1 AND deletado_em IS NULL 
               RETURNING *`,
        values: values,
      };

      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      throw error;
    }
  }

  /**
   * Deleta um endereço (soft delete)
   * @param {string} id - UUID do endereço
   * @returns {Promise<boolean>} true se deletado com sucesso, false se não encontrado
   */
  async delete(id) {
    try {
      const query = {
        text: `UPDATE ${this.tableName} 
               SET deletado_em = NOW() 
               WHERE id = $1 AND deletado_em IS NULL`,
        values: [id],
      };
      const result = await database.query(query);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
      throw error;
    }
  }

  /**
   * Verifica se um endereço existe e está ativo
   * @param {string} id - UUID do endereço
   * @returns {Promise<boolean>} true se existe, false caso contrário
   */
  async exists(id) {
    try {
      const query = {
        text: `SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE id = $1 AND deletado_em IS NULL) as exists`,
        values: [id],
      };
      const result = await database.query(query);
      return result.rows[0].exists;
    } catch (error) {
      console.error("Erro ao verificar existência de endereço:", error);
      throw error;
    }
  }
}

module.exports = EnderecosModel;
