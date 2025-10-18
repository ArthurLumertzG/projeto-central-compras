const database = require("../../db/database");

class CampanhasModel {
  constructor() {
    this.tableName = "campanhaspromocionais";
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
      console.error("Erro ao buscar campanhas:", error);
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
      console.error("Erro ao buscar campanha por ID:", error);
      throw error;
    }
  }

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
