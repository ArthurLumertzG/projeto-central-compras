const database = require("../../db/database");

class PedidosModel {
  constructor() {
    this.tableName = "pedidos";
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
      console.error("Erro ao buscar pedidos:", error);
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
      console.error("Erro ao buscar pedido por ID:", error);
      throw error;
    }
  }

  async selectByDate(date) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE DATE(criado_em) = $1 AND deletado_em IS NULL ORDER BY criado_em DESC`,
        values: [date],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar pedidos por data:", error);
      throw error;
    }
  }

  async create(pedido) {
    try {
      const query = {
        text: `INSERT INTO ${this.tableName} (id, valor_total, descricao, usuario_id, loja_id, status, forma_pagamento, prazo_dias, criado_em) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
               RETURNING *`,
        values: [pedido.id, pedido.valor_total, pedido.descricao, pedido.usuario_id, pedido.loja_id, pedido.status, pedido.forma_pagamento, pedido.prazo_dias, pedido.criado_em],
      };
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    }
  }

  async update(id, pedido) {
    try {
      const fields = Object.keys(pedido);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(", ");
      const values = [id, ...Object.values(pedido)];

      const query = {
        text: `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 AND deletado_em IS NULL RETURNING *`,
        values: values,
      };

      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
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
      console.error("Erro ao deletar pedido:", error);
      throw error;
    }
  }
}

module.exports = PedidosModel;
