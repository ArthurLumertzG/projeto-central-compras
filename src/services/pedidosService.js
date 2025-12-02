const PedidosModel = require("../models/pedidosModel");
const PedidoProdutoModel = require("../models/pedidoProdutoModel");
const ProdutosModel = require("../models/produtosModel");
const LojasModel = require("../models/lojasModel");
const AppError = require("../errors/AppError");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const { v4: uuidv4 } = require("uuid");
const { createPedidoSchema, updatePedidoSchema, uuidSchema, statusSchema, dateSchema } = require("../validations/pedidoValidation");

/**
 * Service responsável pelas regras de negócio de pedidos
 * Gerencia pedidos e seus produtos associados (tabela pedidoproduto)
 * @class PedidosService
 */
class PedidosService {
  constructor() {
    this.pedidosModel = new PedidosModel();
    this.pedidoProdutoModel = new PedidoProdutoModel();
    this.produtosModel = new ProdutosModel();
    this.lojasModel = new LojasModel();
  }

  /**
   * Busca todos os pedidos
   * @returns {Promise<DefaultResponseDto>} Lista de pedidos
   */
  async getAll() {
    const pedidos = await this.pedidosModel.select();

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum pedido encontrado", []);
    }

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidos);
  }

  /**
   * Busca um pedido por ID (com seus itens)
   * @param {string} id - UUID do pedido
   * @returns {Promise<DefaultResponseDto>} Pedido encontrado com seus itens
   * @throws {AppError} 400 se ID inválido, 404 se não encontrado
   */
  async getById(id) {
    // 1. Valida UUID
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Busca pedido
    const pedido = await this.pedidosModel.selectById(id);
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // 3. Busca itens do pedido
    const itens = await this.pedidoProdutoModel.selectByPedidoId(id);

    // 4. Retorna pedido completo com itens
    const pedidoCompleto = {
      ...pedido,
      itens: itens,
    };

    return new DefaultResponseDto(true, "Pedido encontrado com sucesso", pedidoCompleto);
  }

  /**
   * Busca pedidos por usuário
   * @param {string} usuario_id - UUID do usuário
   * @returns {Promise<DefaultResponseDto>} Lista de pedidos do usuário
   * @throws {AppError} 400 se ID inválido
   */
  async getByUsuarioId(usuario_id) {
    // 1. Valida UUID
    const { error } = uuidSchema.validate(usuario_id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Busca pedidos
    const pedidos = await this.pedidosModel.selectByUsuarioId(usuario_id);

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum pedido encontrado para este usuário", []);
    }

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidos);
  }

  /**
   * Busca pedidos por status
   * @param {string} status - Status do pedido
   * @returns {Promise<DefaultResponseDto>} Lista de pedidos
   * @throws {AppError} 400 se status inválido
   */
  async getByStatus(status) {
    // 1. Valida status
    const { error } = statusSchema.validate(status);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Busca pedidos
    const pedidos = await this.pedidosModel.selectByStatus(status);

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, `Nenhum pedido encontrado com status '${status}'`, []);
    }

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidos);
  }

  /**
   * Busca pedidos por data
   * @param {string} date - Data no formato YYYY-MM-DD
   * @returns {Promise<DefaultResponseDto>} Lista de pedidos
   * @throws {AppError} 400 se data inválida
   */
  async getByDate(date) {
    // 1. Valida data
    const { error } = dateSchema.validate(date);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Busca pedidos
    const pedidos = await this.pedidosModel.selectByDate(date);

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, `Nenhum pedido encontrado para a data ${date}`, []);
    }

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidos);
  }

  /**
   * Cria um novo pedido com seus produtos (transação atômica)
   * @param {Object} data - Dados do pedido e produtos
   * @param {string} requestUserId - ID do usuário autenticado (JWT) que será usado como loja_id
   * @returns {Promise<DefaultResponseDto>} Pedido criado com itens
   * @throws {AppError} 400 se validação falhar, 404 se FK inválida, 409 se estoque insuficiente
   */
  async create(data, requestUserId) {
    // 1. Busca a loja do usuário logado
    const loja = await this.lojasModel.selectByUsuarioId(requestUserId);
    if (!loja) {
      throw new AppError("Loja não encontrada para o usuário logado", 404);
    }

    // 2. Adiciona o loja_id correto
    const pedidoData = {
      ...data,
      loja_id: loja.id, // ID da loja, não do usuário
      usuario_id: requestUserId,
    };

    // 3. Validação com Joi
    const { error, value } = createPedidoSchema.validate(pedidoData, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 3. Valida e busca dados dos produtos
    const produtosData = [];
    let valorTotalCalculado = 0;

    for (const item of value.produtos) {
      // Busca produto usando o model
      const produto = await this.produtosModel.selectById(item.produto_id);

      if (!produto) {
        throw new AppError(`Produto com ID ${item.produto_id} não encontrado`, 404);
      }

      // Valida estoque
      if (produto.quantidade_estoque < item.quantidade) {
        throw new AppError(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.quantidade_estoque}, Solicitado: ${item.quantidade}`, 409);
      }

      // Calcula valor total do item
      const valorItem = item.quantidade * item.valor_unitario;
      valorTotalCalculado += valorItem;

      produtosData.push({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        produto: produto,
      });
    }

    // 4. Cria o pedido
    const pedidoId = uuidv4();
    const novoPedido = {
      id: pedidoId,
      valor_total: valorTotalCalculado,
      descricao: value.descricao || null,
      usuario_id: requestUserId,
      loja_id: value.loja_id,
      status: value.status || "pendente",
      forma_pagamento: value.forma_pagamento,
      prazo_dias: value.prazo_dias,
      criado_em: new Date(),
    };

    const pedidoCriado = await this.pedidosModel.create(novoPedido);

    // 5. Cria os itens do pedido (pedidoproduto)
    const itensCriados = [];
    const now = new Date();

    for (const itemData of produtosData) {
      const itemId = uuidv4();
      const novoItem = {
        id: itemId,
        pedido_id: pedidoId,
        produto_id: itemData.produto_id,
        quantidade: itemData.quantidade,
        valor_unitario: itemData.valor_unitario,
        criado_em: now,
        atualizado_em: now,
      };

      const itemCriado = await this.pedidoProdutoModel.create(novoItem);
      itensCriados.push({
        ...itemCriado,
        produto_nome: itemData.produto.nome,
      });

      // 6. Atualiza estoque do produto usando o model
      await this.produtosModel.updateEstoque(itemData.produto_id, -itemData.quantidade);
    }

    // 7. Retorna pedido completo com itens
    const pedidoCompleto = {
      ...pedidoCriado,
      itens: itensCriados,
    };

    return new DefaultResponseDto(true, "Pedido criado com sucesso", pedidoCompleto);
  }

  /**
   * Atualiza um pedido existente
   * @param {string} id - UUID do pedido
   * @param {Object} data - Dados para atualizar
   * @param {string} requestUserId - ID do usuário autenticado (JWT)
   * @returns {Promise<DefaultResponseDto>} Pedido atualizado
   * @throws {AppError} 400 se validação falhar, 403 se não tem permissão, 404 se não encontrado, 409 se pedido não pode ser editado
   */
  async update(id, data, requestUserId) {
    // 1. Valida UUID
    const { error: uuidError } = uuidSchema.validate(id);
    if (uuidError) {
      throw new AppError(uuidError.details[0].message, 400);
    }

    // 2. Verifica se pedido existe
    const pedidoExists = await this.pedidosModel.selectById(id);
    if (!pedidoExists) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // 3. IDOR Protection: Verifica se o pedido pertence ao usuário autenticado
    if (requestUserId && pedidoExists.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para atualizar este pedido", 403);
    }

    // 4. Verifica se pedido pode ser editado (apenas status pendente)
    if (pedidoExists.status !== "pendente") {
      throw new AppError(`Pedido com status '${pedidoExists.status}' não pode ser editado`, 409);
    }

    // 5. Validação com Joi
    const { error, value } = updatePedidoSchema.validate(data, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 6. Atualiza timestamps de status (se mudou)
    const updateData = { ...value };

    if (value.status && value.status !== pedidoExists.status) {
      if (value.status === "enviado") {
        updateData.enviado_em = new Date();
      } else if (value.status === "entregue") {
        updateData.entregue_em = new Date();
      }
    }

    // 7. Atualiza no banco
    const pedidoAtualizado = await this.pedidosModel.update(id, updateData);

    return new DefaultResponseDto(true, "Pedido atualizado com sucesso", pedidoAtualizado);
  }

  /**
   * Deleta um pedido (soft delete) e seus itens
   * @param {string} id - UUID do pedido
   * @param {string} requestUserId - ID do usuário autenticado (JWT)
   * @returns {Promise<DefaultResponseDto>} Confirmação de deleção
   * @throws {AppError} 400 se ID inválido, 403 se não tem permissão, 404 se não encontrado, 409 se pedido não pode ser deletado
   */
  async delete(id, requestUserId) {
    // 1. Valida UUID
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // 2. Verifica se pedido existe
    const pedidoExists = await this.pedidosModel.selectById(id);
    if (!pedidoExists) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // 3. IDOR Protection: Verifica se o pedido pertence ao usuário autenticado
    if (requestUserId && pedidoExists.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para deletar este pedido", 403);
    }

    // 4. Verifica se pedido pode ser deletado (apenas pendente ou cancelado)
    if (!["pendente", "cancelado"].includes(pedidoExists.status)) {
      throw new AppError(`Pedido com status '${pedidoExists.status}' não pode ser deletado`, 409);
    }

    // 5. Deleta itens do pedido primeiro (soft delete)
    await this.pedidoProdutoModel.deleteByPedidoId(id);

    // 6. Deleta o pedido (soft delete)
    await this.pedidosModel.delete(id);

    return new DefaultResponseDto(true, "Pedido deletado com sucesso", null);
  }

  /**
   * Busca pedidos de um fornecedor específico
   * @param {string} fornecedorId - UUID do fornecedor
   * @returns {Promise<DefaultResponseDto>} Lista de pedidos do fornecedor
   * @throws {AppError} 400 se ID inválido
   */
  async getByFornecedor(fornecedorId) {
    // Valida UUID
    const { error } = uuidSchema.validate(fornecedorId);
    if (error) {
      throw new AppError("ID do fornecedor inválido", 400);
    }

    const pedidos = await this.pedidosModel.selectByFornecedor(fornecedorId);
    return new DefaultResponseDto(true, "Pedidos recuperados com sucesso", pedidos);
  }
}

module.exports = PedidosService;
