const database = require("../../db/database");

/**
 * Model responsável pelas operações de banco de dados da tabela pedidoproduto
 * Tabela associativa entre pedidos e produtos
 * @class PedidoProdutoModel
 */
class PedidoProdutoModel {
  constructor() {
    this.tableName = "pedidoproduto";
  }

  /**
   * Busca todos os itens de um pedido específico
   * @param {string} pedido_id - UUID do pedido
   * @returns {Promise<Array>} Lista de itens do pedido
   * @throws {Error} Erro ao buscar itens
   */
  async selectByPedidoId(pedido_id) {
    try {
      const query = {
        text: `
          SELECT pp.*, p.nome as produto_nome, p.categoria as produto_categoria
          FROM ${this.tableName} pp
          INNER JOIN produtos p ON pp.produto_id = p.id
          WHERE pp.pedido_id = $1 AND pp.deletado_em IS NULL
          ORDER BY pp.criado_em ASC
        `,
        values: [pedido_id],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar itens do pedido:", error);
      throw error;
    }
  }

  /**
   * Busca um item específico por ID
   * @param {string} id - UUID do item
   * @returns {Promise<Object|null>} Item encontrado ou null
   * @throws {Error} Erro ao buscar item
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
      console.error("Erro ao buscar item por ID:", error);
      throw error;
    }
  }

  /**
   * Cria um novo item no pedido
   * @param {Object} item - Dados do item
   * @returns {Promise<Object>} Item criado
   * @throws {Error} Erro ao criar item
   */
  async create(item) {
    try {
      const query = {
        text: `
          INSERT INTO ${this.tableName} 
          (id, pedido_id, produto_id, quantidade, valor_unitario, criado_em, atualizado_em) 
          VALUES ($1, $2, $3, $4, $5, $6, $7) 
          RETURNING *
        `,
        values: [item.id, item.pedido_id, item.produto_id, item.quantidade, item.valor_unitario, item.criado_em, item.atualizado_em],
      };
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar item do pedido:", error);
      throw error;
    }
  }

  /**
   * Cria múltiplos itens de uma vez (bulk insert)
   * @param {Array<Object>} items - Array de itens para inserir
   * @returns {Promise<Array>} Itens criados
   * @throws {Error} Erro ao criar itens
   */
  async createMany(items) {
    try {
      if (!items || items.length === 0) {
        return [];
      }

      // Constrói a query dinamicamente para múltiplos inserts
      const values = [];
      const placeholders = items
        .map((item, index) => {
          const offset = index * 7;
          values.push(item.id, item.pedido_id, item.produto_id, item.quantidade, item.valor_unitario, item.criado_em, item.atualizado_em);
          return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`;
        })
        .join(", ");

      const query = {
        text: `
          INSERT INTO ${this.tableName} 
          (id, pedido_id, produto_id, quantidade, valor_unitario, criado_em, atualizado_em) 
          VALUES ${placeholders}
          RETURNING *
        `,
        values: values,
      };

      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao criar itens do pedido em lote:", error);
      throw error;
    }
  }

  /**
   * Atualiza um item do pedido
   * @param {string} id - UUID do item
   * @param {Object} data - Dados para atualizar
   * @returns {Promise<Object|null>} Item atualizado ou null
   * @throws {Error} Erro ao atualizar item
   */
  async update(id, data) {
    try {
      const fields = Object.keys(data);
      const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(", ");
      const values = [id, ...Object.values(data)];

      const query = {
        text: `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 AND deletado_em IS NULL RETURNING *`,
        values: values,
      };

      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar item do pedido:", error);
      throw error;
    }
  }

  /**
   * Deleta um item (soft delete)
   * @param {string} id - UUID do item
   * @returns {Promise<boolean>} true se deletou, false caso contrário
   * @throws {Error} Erro ao deletar item
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
      console.error("Erro ao deletar item do pedido:", error);
      throw error;
    }
  }

  /**
   * Deleta todos os itens de um pedido (soft delete)
   * @param {string} pedido_id - UUID do pedido
   * @returns {Promise<boolean>} true se deletou, false caso contrário
   * @throws {Error} Erro ao deletar itens
   */
  async deleteByPedidoId(pedido_id) {
    try {
      const query = {
        text: `UPDATE ${this.tableName} SET deletado_em = NOW() WHERE pedido_id = $1 AND deletado_em IS NULL`,
        values: [pedido_id],
      };
      const result = await database.query(query);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Erro ao deletar itens do pedido:", error);
      throw error;
    }
  }
}

module.exports = PedidoProdutoModel;
