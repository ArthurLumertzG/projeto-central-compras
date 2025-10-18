const database = require("../../db/database");

class StoresModel {
  constructor() {
    this.tableName = "lojas";
  }

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

  async selectByEmail(email) {
    try {
      const query = {
        text: `SELECT l.*, u.email FROM ${this.tableName} l 
               INNER JOIN usuarios u ON l.usuario_id = u.id 
               WHERE u.email = $1 AND l.deletado_em IS NULL`,
        values: [email],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar loja por email:", error);
      throw error;
    }
  }

  async create(loja) {
    try {
      const query = {
        text: `INSERT INTO ${this.tableName} (id, nome, cnpj, usuario_id, endereco_id, criado_em, atualizado_em) 
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

  async update(id, loja) {
    try {
      const fields = Object.keys(loja);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(", ");
      const values = [id, ...Object.values(loja)];

      const query = {
        text: `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 AND deletado_em IS NULL RETURNING *`,
        values: values,
      };

      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar loja:", error);
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
      console.error("Erro ao deletar loja:", error);
      throw error;
    }
  }
}

module.exports = StoresModel;
