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

  async selectByEmail(email) {
    try {
      const query = {
        text: `SELECT f.*, u.email FROM ${this.tableName} f 
               INNER JOIN usuarios u ON f.usuario_id = u.id 
               WHERE u.email = $1 AND f.deletado_em IS NULL`,
        values: [email],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar fornecedor por email:", error);
      throw error;
    }
  }

  async create(fornecedor) {
    try {
      const query = {
        text: `INSERT INTO ${this.tableName} (id, cnpj, descricao, usuario_id, criado_em, atualizado_em) 
               VALUES ($1, $2, $3, $4, $5, $6) 
               RETURNING *`,
        values: [fornecedor.id, fornecedor.cnpj, fornecedor.descricao, fornecedor.usuario_id, fornecedor.criado_em, fornecedor.atualizado_em],
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
