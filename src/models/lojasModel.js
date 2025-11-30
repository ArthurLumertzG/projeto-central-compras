const database = require("../../db/database");

/**
 * @class LojasModel
 * @description Model responsável pelas operações de banco de dados da tabela lojas
 * Implementa soft delete e queries parametrizadas
 */
class LojasModel {
  constructor() {
    this.tableName = "lojas";
  }

  /**
   * Retorna todas as lojas ativas (não deletadas)
   * @returns {Promise<Array>} Lista de lojas ordenadas por nome
   */
  async select() {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE deletado_em IS NULL ORDER BY nome ASC`,
        values: [],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      throw error;
    }
  }

  /**
   * Busca uma loja por ID
   * @param {string} id - UUID da loja
   * @returns {Promise<Object|null>} Loja encontrada ou null
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
      console.error("Erro ao buscar loja por ID:", error);
      throw error;
    }
  }

  /**
   * Busca uma loja por CNPJ
   * @param {string} cnpj - CNPJ da loja (14 dígitos)
   * @returns {Promise<Object|null>} Loja encontrada ou null
   */
  async selectByCnpj(cnpj) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE cnpj = $1 AND deletado_em IS NULL`,
        values: [cnpj],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar loja por CNPJ:", error);
      throw error;
    }
  }

  /**
   * Busca lojas por usuário responsável
   * @param {string} usuario_id - UUID do usuário
   * @returns {Promise<Array>} Lista de lojas do usuário
   */
  async selectByUsuarioId(usuario_id) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} 
               WHERE usuario_id = $1 
               AND deletado_em IS NULL 
               ORDER BY nome ASC`,
        values: [usuario_id],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar lojas por usuário:", error);
      throw error;
    }
  }

  /**
   * Cria uma nova loja
   * @param {Object} loja - Dados da loja
   * @returns {Promise<Object>} Loja criada
   */
  async create(loja) {
    try {
      const query = {
        text: `INSERT INTO ${this.tableName} 
               (id, nome, cnpj, usuario_id, endereco_id, criado_em, atualizado_em) 
               VALUES ($1, $2, $3, $4, $5, $6, $7) 
               RETURNING *`,
        values: [loja.id, loja.nome, loja.cnpj, loja.usuario_id, loja.endereco_id || null, loja.criado_em, loja.atualizado_em],
      };
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar loja:", error);
      throw error;
    }
  }

  /**
   * Atualiza uma loja existente
   * @param {string} id - UUID da loja
   * @param {Object} loja - Dados para atualização
   * @returns {Promise<Object|null>} Loja atualizada ou null se não encontrada
   */
  async update(id, loja) {
    try {
      const fields = Object.keys(loja);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(", ");
      const values = [id, ...Object.values(loja)];

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
      console.error("Erro ao atualizar loja:", error);
      throw error;
    }
  }

  /**
   * Deleta uma loja (soft delete)
   * @param {string} id - UUID da loja
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
      console.error("Erro ao deletar loja:", error);
      throw error;
    }
  }
}

module.exports = LojasModel;
