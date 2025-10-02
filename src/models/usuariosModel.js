const database = require("../../db/database");

class UsuariosModel {
  constructor() {
    this.tableName = "usuarios";
  }

  async select() {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} ORDER BY nome ASC`,
        values: [],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }

  async selectById(id) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
        values: [id],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw error;
    }
  }

  async selectByEmail(email) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE email = $1`,
        values: [email],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw error;
    }
  }

  async create(usuario) {
    try {
      const query = {
        text: `INSERT INTO ${this.tableName} (id, nome, sobrenome, senha, email, telefone, funcao, criado_em, atualizado_em) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
               RETURNING *`,
        values: [usuario.id, usuario.nome, usuario.sobrenome, usuario.senha, usuario.email, usuario.telefone, usuario.funcao, usuario.criado_em, usuario.atualizado_em],
      };
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }

  async update(id, usuario) {
    try {
      const fields = Object.keys(usuario);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(", ");
      const values = [id, ...Object.values(usuario)];

      const query = {
        text: `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`,
        values: values,
      };

      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const query = {
        text: `DELETE FROM ${this.tableName} WHERE id = $1`,
        values: [id],
      };
      const result = await database.query(query);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }
}

module.exports = UsuariosModel;
