const database = require("../../db/database");

/**
 * Model responsável pelas operações de banco de dados da tabela pedidos
 * @class PedidosModel
 */
class PedidosModel {
  constructor() {
    this.tableName = "pedidos";
  }

  /**
   * Busca todos os pedidos não deletados
   * @returns {Promise<Array>} Lista de pedidos
   * @throws {Error} Erro ao buscar pedidos
   */
  async select() {
    try {
      const query = {
        text: `
          SELECT 
            p.*,
            json_build_object(
              'id', l.id,
              'nome', l.nome,
              'cnpj', l.cnpj,
              'usuario_id', l.usuario_id,
              'endereco_id', l.endereco_id
            ) as loja
          FROM ${this.tableName} p
          LEFT JOIN lojas l ON p.loja_id = l.id
          WHERE p.deletado_em IS NULL 
          ORDER BY p.criado_em DESC
        `,
        values: [],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw error;
    }
  }

  /**
   * Busca um pedido por ID
   * @param {string} id - UUID do pedido
   * @returns {Promise<Object|null>} Pedido encontrado ou null
   * @throws {Error} Erro ao buscar pedido
   */
  async selectById(id) {
    try {
      const query = {
        text: `
          SELECT 
            p.*,
            json_build_object(
              'id', l.id,
              'nome', l.nome,
              'cnpj', l.cnpj,
              'usuario_id', l.usuario_id,
              'endereco_id', l.endereco_id
            ) as loja
          FROM ${this.tableName} p
          LEFT JOIN lojas l ON p.loja_id = l.id
          WHERE p.id = $1 AND p.deletado_em IS NULL
        `,
        values: [id],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar pedido por ID:", error);
      throw error;
    }
  }

  /**
   * Busca pedidos por usuário
   * @param {string} usuario_id - UUID do usuário
   * @returns {Promise<Array>} Lista de pedidos do usuário
   * @throws {Error} Erro ao buscar pedidos
   */
  async selectByUsuarioId(usuario_id) {
    try {
      const query = {
        text: `
          SELECT 
            p.*,
            json_build_object(
              'id', l.id,
              'nome', l.nome,
              'cnpj', l.cnpj,
              'usuario_id', l.usuario_id,
              'endereco_id', l.endereco_id
            ) as loja
          FROM ${this.tableName} p
          LEFT JOIN lojas l ON p.loja_id = l.id
          WHERE p.usuario_id = $1 AND p.deletado_em IS NULL 
          ORDER BY p.criado_em DESC
        `,
        values: [usuario_id],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar pedidos por usuário:", error);
      throw error;
    }
  }

  /**
   * Busca pedidos por loja
   * @param {string} loja_id - UUID da loja
   * @returns {Promise<Array>} Lista de pedidos da loja
   * @throws {Error} Erro ao buscar pedidos
   */
  async selectByLojaId(loja_id) {
    try {
      const query = {
        text: `
          SELECT 
            p.*,
            json_build_object(
              'id', l.id,
              'nome', l.nome,
              'cnpj', l.cnpj,
              'usuario_id', l.usuario_id,
              'endereco_id', l.endereco_id
            ) as loja
          FROM ${this.tableName} p
          LEFT JOIN lojas l ON p.loja_id = l.id
          WHERE p.loja_id = $1 AND p.deletado_em IS NULL 
          ORDER BY p.criado_em DESC
        `,
        values: [loja_id],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar pedidos por loja:", error);
      throw error;
    }
  }

  /**
   * Busca pedidos por status
   * @param {string} status - Status do pedido
   * @returns {Promise<Array>} Lista de pedidos com o status especificado
   * @throws {Error} Erro ao buscar pedidos
   */
  async selectByStatus(status) {
    try {
      const query = {
        text: `
          SELECT 
            p.*,
            json_build_object(
              'id', l.id,
              'nome', l.nome,
              'cnpj', l.cnpj,
              'usuario_id', l.usuario_id,
              'endereco_id', l.endereco_id
            ) as loja
          FROM ${this.tableName} p
          LEFT JOIN lojas l ON p.loja_id = l.id
          WHERE p.status = $1 AND p.deletado_em IS NULL 
          ORDER BY p.criado_em DESC
        `,
        values: [status],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar pedidos por status:", error);
      throw error;
    }
  }

  /**
   * Busca pedidos por data (apenas a data, sem hora)
   * @param {string} date - Data no formato YYYY-MM-DD
   * @returns {Promise<Array>} Lista de pedidos da data especificada
   * @throws {Error} Erro ao buscar pedidos
   */
  async selectByDate(date) {
    try {
      const query = {
        text: `
          SELECT 
            p.*,
            json_build_object(
              'id', l.id,
              'nome', l.nome,
              'cnpj', l.cnpj,
              'usuario_id', l.usuario_id,
              'endereco_id', l.endereco_id
            ) as loja
          FROM ${this.tableName} p
          LEFT JOIN lojas l ON p.loja_id = l.id
          WHERE DATE(p.criado_em) = $1 AND p.deletado_em IS NULL 
          ORDER BY p.criado_em DESC
        `,
        values: [date],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar pedidos por data:", error);
      throw error;
    }
  }

  /**
   * Cria um novo pedido no banco de dados
   * @param {Object} pedido - Dados do pedido
   * @returns {Promise<Object>} Pedido criado
   * @throws {Error} Erro ao criar pedido
   */
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

  /**
   * Atualiza um pedido existente
   * @param {string} id - UUID do pedido
   * @param {Object} pedido - Dados para atualizar
   * @returns {Promise<Object|null>} Pedido atualizado ou null
   * @throws {Error} Erro ao atualizar pedido
   */
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

  /**
   * Deleta um pedido (soft delete)
   * @param {string} id - UUID do pedido
   * @returns {Promise<boolean>} true se deletou, false caso contrário
   * @throws {Error} Erro ao deletar pedido
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
      console.error("Erro ao deletar pedido:", error);
      throw error;
    }
  }
}

module.exports = PedidosModel;
