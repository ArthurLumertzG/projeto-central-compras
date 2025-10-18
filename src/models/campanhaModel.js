const database = require("../../db/database");

/**
 * Model responsável pelas operações de banco de dados da tabela campanhaspromocionais
 * @class CampanhasModel
 */
class CampanhasModel {
  constructor() {
    this.tableName = "campanhaspromocionais";
  }

  /**
   * Busca todas as campanhas não deletadas
   * @returns {Promise<Array>} Lista de campanhas
   * @throws {Error} Erro ao buscar campanhas
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
      console.error("Erro ao buscar campanhas:", error);
      throw error;
    }
  }

  /**
   * Busca uma campanha por ID
   * @param {string} id - UUID da campanha
   * @returns {Promise<Object|null>} Campanha encontrada ou null
   * @throws {Error} Erro ao buscar campanha
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
      console.error("Erro ao buscar campanha por ID:", error);
      throw error;
    }
  }

  /**
   * Busca uma campanha por nome (case-sensitive)
   * @param {string} nome - Nome da campanha
   * @returns {Promise<Object|null>} Campanha encontrada ou null
   * @throws {Error} Erro ao buscar campanha
   */
  async selectByNome(nome) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE nome = $1 AND deletado_em IS NULL`,
        values: [nome],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar campanha por nome:", error);
      throw error;
    }
  }

  /**
   * Busca campanhas por status
   * @param {string} status - Status da campanha (ativa, inativa, expirada)
   * @returns {Promise<Array>} Lista de campanhas com o status especificado
   * @throws {Error} Erro ao buscar campanhas
   */
  async selectByStatus(status) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE status = $1 AND deletado_em IS NULL ORDER BY criado_em DESC`,
        values: [status],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar campanhas por status:", error);
      throw error;
    }
  }

  /**
   * Cria uma nova campanha no banco de dados
   * @param {Object} campanha - Dados da campanha
   * @returns {Promise<Object>} Campanha criada
   * @throws {Error} Erro ao criar campanha
   */
  async create(campanha) {
    try {
      const query = {
        text: `INSERT INTO ${this.tableName} (id, nome, descricao, valor_min, quantidade_min, desconto_porcentagem, status, criado_em, atualizado_em) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
               RETURNING *`,
        values: [campanha.id, campanha.nome, campanha.descricao, campanha.valor_min, campanha.quantidade_min, campanha.desconto_porcentagem, campanha.status, campanha.criado_em, campanha.atualizado_em],
      };
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      throw error;
    }
  }

  /**
   * Atualiza uma campanha existente
   * @param {string} id - UUID da campanha
   * @param {Object} campanha - Dados para atualizar
   * @returns {Promise<Object|null>} Campanha atualizada ou null
   * @throws {Error} Erro ao atualizar campanha
   */
  async update(id, campanha) {
    try {
      const fields = Object.keys(campanha);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(", ");
      const values = [id, ...Object.values(campanha)];

      const query = {
        text: `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 AND deletado_em IS NULL RETURNING *`,
        values: values,
      };

      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar campanha:", error);
      throw error;
    }
  }

  /**
   * Deleta uma campanha (soft delete)
   * @param {string} id - UUID da campanha
   * @returns {Promise<boolean>} true se deletou, false caso contrário
   * @throws {Error} Erro ao deletar campanha
   */
  async delete(id) {
    try {
      const query = {
        text: `UPDATE ${this.tableName} SET deletado_em = NOW() WHERE id = $1 AND deletado_em IS NULL`,
        values: [id],
      };
      const result = await database.query(query);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Erro ao deletar campanha:", error);
      throw error;
    }
  }
}

module.exports = CampanhasModel;
