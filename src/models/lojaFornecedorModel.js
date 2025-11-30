const database = require("../../db/database");

/**
 * Model responsável pelas operações de banco de dados da tabela lojafornecedor
 * Tabela associativa entre lojas e fornecedores (relação N:N)
 * @class LojaFornecedorModel
 */
class LojaFornecedorModel {
  constructor() {
    this.tableName = "lojafornecedor";
  }

  /**
   * Busca todos os vínculos loja-fornecedor ativos
   * @returns {Promise<Array>} Lista de vínculos com dados de loja e fornecedor
   * @throws {Error} Erro ao buscar vínculos
   */
  async select() {
    try {
      const query = {
        text: `
          SELECT 
            lf.*,
            l.nome as loja_nome,
            l.cnpj as loja_cnpj,
            f.descricao as fornecedor_descricao,
            f.cnpj as fornecedor_cnpj
          FROM ${this.tableName} lf
          INNER JOIN lojas l ON lf.loja_id = l.id
          INNER JOIN fornecedores f ON lf.fornecedor_id = f.id
          WHERE lf.deletado_em IS NULL
          ORDER BY lf.criado_em DESC
        `,
        values: [],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar vínculos loja-fornecedor:", error);
      throw error;
    }
  }

  /**
   * Busca vínculo específico por loja_id e fornecedor_id
   * @param {string} loja_id - UUID da loja
   * @param {string} fornecedor_id - UUID do fornecedor
   * @returns {Promise<Object|null>} Vínculo encontrado ou null
   * @throws {Error} Erro ao buscar vínculo
   */
  async selectByLojaAndFornecedor(loja_id, fornecedor_id) {
    try {
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE loja_id = $1 AND fornecedor_id = $2 AND deletado_em IS NULL`,
        values: [loja_id, fornecedor_id],
      };
      const result = await database.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar vínculo loja-fornecedor:", error);
      throw error;
    }
  }

  /**
   * Busca todos os fornecedores de uma loja específica
   * @param {string} loja_id - UUID da loja
   * @returns {Promise<Array>} Lista de fornecedores vinculados à loja
   * @throws {Error} Erro ao buscar fornecedores
   */
  async selectFornecedoresByLojaId(loja_id) {
    try {
      const query = {
        text: `
          SELECT 
            f.id,
            f.cnpj,
            f.descricao,
            f.usuario_id,
            f.criado_em,
            f.atualizado_em,
            lf.criado_em as vinculado_em
          FROM ${this.tableName} lf
          INNER JOIN fornecedores f ON lf.fornecedor_id = f.id
          WHERE lf.loja_id = $1 AND lf.deletado_em IS NULL AND f.deletado_em IS NULL
          ORDER BY lf.criado_em DESC
        `,
        values: [loja_id],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar fornecedores da loja:", error);
      throw error;
    }
  }

  /**
   * Busca todas as lojas atendidas por um fornecedor específico
   * @param {string} fornecedor_id - UUID do fornecedor
   * @returns {Promise<Array>} Lista de lojas atendidas pelo fornecedor
   * @throws {Error} Erro ao buscar lojas
   */
  async selectLojasByFornecedorId(fornecedor_id) {
    try {
      const query = {
        text: `
          SELECT 
            l.id,
            l.nome,
            l.cnpj,
            l.usuario_id,
            l.endereco_id,
            l.criado_em,
            l.atualizado_em,
            lf.criado_em as vinculado_em
          FROM ${this.tableName} lf
          INNER JOIN lojas l ON lf.loja_id = l.id
          WHERE lf.fornecedor_id = $1 AND lf.deletado_em IS NULL AND l.deletado_em IS NULL
          ORDER BY lf.criado_em DESC
        `,
        values: [fornecedor_id],
      };
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar lojas do fornecedor:", error);
      throw error;
    }
  }

  /**
   * Cria um novo vínculo loja-fornecedor
   * @param {Object} vinculo - Dados do vínculo
   * @returns {Promise<Object>} Vínculo criado
   * @throws {Error} Erro ao criar vínculo
   */
  async create(vinculo) {
    try {
      const query = {
        text: `
          INSERT INTO ${this.tableName} 
          (loja_id, fornecedor_id, criado_em, atualizado_em) 
          VALUES ($1, $2, $3, $4) 
          RETURNING *
        `,
        values: [vinculo.loja_id, vinculo.fornecedor_id, vinculo.criado_em, vinculo.atualizado_em],
      };
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar vínculo loja-fornecedor:", error);
      throw error;
    }
  }

  /**
   * Deleta um vínculo loja-fornecedor (soft delete)
   * @param {string} loja_id - UUID da loja
   * @param {string} fornecedor_id - UUID do fornecedor
   * @returns {Promise<boolean>} true se deletou, false caso contrário
   * @throws {Error} Erro ao deletar vínculo
   */
  async delete(loja_id, fornecedor_id) {
    try {
      const query = {
        text: `UPDATE ${this.tableName} SET deletado_em = NOW() WHERE loja_id = $1 AND fornecedor_id = $2 AND deletado_em IS NULL`,
        values: [loja_id, fornecedor_id],
      };
      const result = await database.query(query);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Erro ao deletar vínculo loja-fornecedor:", error);
      throw error;
    }
  }

  /**
   * Deleta todos os vínculos de uma loja (soft delete)
   * @param {string} loja_id - UUID da loja
   * @returns {Promise<boolean>} true se deletou, false caso contrário
   * @throws {Error} Erro ao deletar vínculos
   */
  async deleteByLojaId(loja_id) {
    try {
      const query = {
        text: `UPDATE ${this.tableName} SET deletado_em = NOW() WHERE loja_id = $1 AND deletado_em IS NULL`,
        values: [loja_id],
      };
      const result = await database.query(query);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Erro ao deletar vínculos da loja:", error);
      throw error;
    }
  }

  /**
   * Deleta todos os vínculos de um fornecedor (soft delete)
   * @param {string} fornecedor_id - UUID do fornecedor
   * @returns {Promise<boolean>} true se deletou, false caso contrário
   * @throws {Error} Erro ao deletar vínculos
   */
  async deleteByFornecedorId(fornecedor_id) {
    try {
      const query = {
        text: `UPDATE ${this.tableName} SET deletado_em = NOW() WHERE fornecedor_id = $1 AND deletado_em IS NULL`,
        values: [fornecedor_id],
      };
      const result = await database.query(query);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Erro ao deletar vínculos do fornecedor:", error);
      throw error;
    }
  }
}

module.exports = LojaFornecedorModel;
