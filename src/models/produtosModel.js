const database = require("../../db/database");

class ProdutosModel {
  constructor() {
    this.tableName = "produtos";
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
      console.error("Erro ao buscar produtos:", error);
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
      console.error("Erro ao buscar produto por ID:", error);
      throw error;
    }
  }

  async selectByName(nome) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE LOWER(nome) = LOWER($1) AND deletado_em IS NULL`,
        values: [nome],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar produto por nome:", error);
      throw error;
    }
  }

  async create(produto) {
    try {
      const query = {
        text: `INSERT INTO ${this.tableName} (id, nome, descricao, valor_unitario, quantidade_estoque, fornecedor_id, categoria, imagem_url, criado_em, atualizado_em) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
               RETURNING *`,
        values: [produto.id, produto.nome, produto.descricao, produto.valor_unitario, produto.quantidade_estoque, produto.fornecedor_id, produto.categoria, produto.imagem_url, produto.criado_em, produto.atualizado_em],
      };
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  }

  async update(id, produto) {
    try {
      const fields = Object.keys(produto);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(", ");
      const values = [id, ...Object.values(produto)];

      const query = {
        text: `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 AND deletado_em IS NULL RETURNING *`,
        values: values,
      };

      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
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
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  }

  async selectByFornecedor(fornecedorId) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE fornecedor_id = $1 AND deletado_em IS NULL ORDER BY nome ASC`,
        values: [fornecedorId],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar produtos por fornecedor:", error);
      throw error;
    }
  }
}

module.exports = ProdutosModel;
