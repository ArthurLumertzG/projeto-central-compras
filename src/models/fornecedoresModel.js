const database = require("../../db/database");

class FornecedoresModel {
  constructor() {
    this.tableName = "fornecedores";
  }

  async select() {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE deletado_em IS NULL ORDER BY criado_em DESC`,
        values: [],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE id = $1 AND deletado_em IS NULL`,
        values: [id],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar fornecedor por ID:", error);
      throw error;
    }
  }

  /**
   * Busca um fornecedor por CNPJ
   * @param {string} cnpj - CNPJ do fornecedor (14 dígitos)
   * @returns {Promise<Object|null>} Fornecedor encontrado ou null
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
      console.error("Erro ao buscar fornecedor por CNPJ:", error);
      throw error;
    }
  }

  /**
   * Busca fornecedores por usuário responsável
   * @param {string} usuario_id - UUID do usuário
   * @returns {Promise<Array>} Lista de fornecedores do usuário
   */
  async selectByUsuarioId(usuario_id) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} 
               WHERE usuario_id = $1 
               AND deletado_em IS NULL 
               ORDER BY criado_em DESC`,
        values: [usuario_id],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar fornecedores por usuário:", error);
      throw error;
    }
  }

  async create(fornecedor) {
    try {
      const query = {
        text: `INSERT INTO ${this.tableName} (id, cnpj, razao_social, nome_fantasia, descricao, usuario_id, endereco_id, criado_em, atualizado_em) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
               RETURNING *`,
        values: [
          fornecedor.id,
          fornecedor.cnpj,
          fornecedor.razao_social || null,
          fornecedor.nome_fantasia || null,
          fornecedor.descricao || null,
          fornecedor.usuario_id || null,
          fornecedor.endereco_id || null,
          fornecedor.criado_em,
          fornecedor.atualizado_em,
        ],
      };
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
      throw error;
    }
  }

  async update(id, fornecedor) {
    try {
      const fields = Object.keys(fornecedor);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(", ");
      const values = [id, ...Object.values(fornecedor)];

      const query = {
        text: `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 AND deletado_em IS NULL RETURNING *`,
        values: values,
      };

      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const query = {
        text: `UPDATE ${this.tableName} SET deletado_em = NOW() WHERE id = $1 AND deletado_em IS NULL`,
        values: [id],
      };
      const result = await database.query(query);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      throw error;
    }
  }
}

module.exports = FornecedoresModel;
