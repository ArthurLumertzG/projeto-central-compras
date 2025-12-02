const PedidosModel = require("../models/pedidosModel");
const PedidoProdutoModel = require("../models/pedidoProdutoModel");
const ProdutosModel = require("../models/produtosModel");
const LojasModel = require("../models/lojasModel");
const AppError = require("../errors/AppError");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const { v4: uuidv4 } = require("uuid");
const { createPedidoSchema, updatePedidoSchema, uuidSchema, statusSchema, dateSchema } = require("../validations/pedidoValidation");

class PedidosService {
  constructor() {
    this.pedidosModel = new PedidosModel();
    this.pedidoProdutoModel = new PedidoProdutoModel();
    this.produtosModel = new ProdutosModel();
    this.lojasModel = new LojasModel();
  }

  async getAll() {
    const pedidos = await this.pedidosModel.select();

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum pedido encontrado", []);
    }

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidos);
  }

  async getById(id) {
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const pedido = await this.pedidosModel.selectById(id);
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404);
    }

    const itens = await this.pedidoProdutoModel.selectByPedidoId(id);

    const pedidoCompleto = {
      ...pedido,
      itens: itens,
    };

    return new DefaultResponseDto(true, "Pedido encontrado com sucesso", pedidoCompleto);
  }

  async getByUsuarioId(usuario_id) {
    const { error } = uuidSchema.validate(usuario_id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const pedidos = await this.pedidosModel.selectByUsuarioId(usuario_id);

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum pedido encontrado para este usuário", []);
    }

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidos);
  }

  async getByStatus(status) {
    const { error } = statusSchema.validate(status);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const pedidos = await this.pedidosModel.selectByStatus(status);

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, `Nenhum pedido encontrado com status '${status}'`, []);
    }

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidos);
  }

  async getByDate(date) {
    const { error } = dateSchema.validate(date);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const pedidos = await this.pedidosModel.selectByDate(date);

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, `Nenhum pedido encontrado para a data ${date}`, []);
    }

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidos);
  }

  async create(data, requestUserId) {
    const loja = await this.lojasModel.selectByUsuarioId(requestUserId);
    if (!loja) {
      throw new AppError("Loja não encontrada para o usuário logado", 404);
    }

    const pedidoData = {
      ...data,
      loja_id: loja.id,
      usuario_id: requestUserId,
    };

    const { error, value } = createPedidoSchema.validate(pedidoData, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const produtosData = [];
    let valorTotalCalculado = 0;

    for (const item of value.produtos) {
      const produto = await this.produtosModel.selectById(item.produto_id);

      if (!produto) {
        throw new AppError(`Produto com ID ${item.produto_id} não encontrado`, 404);
      }

      if (produto.quantidade_estoque < item.quantidade) {
        throw new AppError(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.quantidade_estoque}, Solicitado: ${item.quantidade}`, 409);
      }

      const valorItem = item.quantidade * item.valor_unitario;
      valorTotalCalculado += valorItem;

      produtosData.push({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        produto: produto,
      });
    }

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

      await this.produtosModel.updateEstoque(itemData.produto_id, -itemData.quantidade);
    }

    const pedidoCompleto = {
      ...pedidoCriado,
      itens: itensCriados,
    };

    return new DefaultResponseDto(true, "Pedido criado com sucesso", pedidoCompleto);
  }

  async update(id, data, requestUserId) {
    const { error: uuidError } = uuidSchema.validate(id);
    if (uuidError) {
      throw new AppError(uuidError.details[0].message, 400);
    }

    const pedidoExists = await this.pedidosModel.selectById(id);
    if (!pedidoExists) {
      throw new AppError("Pedido não encontrado", 404);
    }

    if (requestUserId && pedidoExists.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para atualizar este pedido", 403);
    }

    if (pedidoExists.status !== "pendente") {
      throw new AppError(`Pedido com status '${pedidoExists.status}' não pode ser editado`, 409);
    }

    const { error, value } = updatePedidoSchema.validate(data, { stripUnknown: true });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const updateData = { ...value };

    if (value.status && value.status !== pedidoExists.status) {
      if (value.status === "enviado") {
        updateData.enviado_em = new Date();
      } else if (value.status === "entregue") {
        updateData.entregue_em = new Date();
      }
    }

    const pedidoAtualizado = await this.pedidosModel.update(id, updateData);

    return new DefaultResponseDto(true, "Pedido atualizado com sucesso", pedidoAtualizado);
  }

  async delete(id, requestUserId) {
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const pedidoExists = await this.pedidosModel.selectById(id);
    if (!pedidoExists) {
      throw new AppError("Pedido não encontrado", 404);
    }

    if (requestUserId && pedidoExists.usuario_id !== requestUserId) {
      throw new AppError("Você não tem permissão para deletar este pedido", 403);
    }

    if (!["pendente", "cancelado"].includes(pedidoExists.status)) {
      throw new AppError(`Pedido com status '${pedidoExists.status}' não pode ser deletado`, 409);
    }

    await this.pedidoProdutoModel.deleteByPedidoId(id);

    await this.pedidosModel.delete(id);

    return new DefaultResponseDto(true, "Pedido deletado com sucesso", null);
  }

  async getByFornecedor(fornecedorId) {
    const { error } = uuidSchema.validate(fornecedorId);
    if (error) {
      throw new AppError("ID do fornecedor inválido", 400);
    }

    const pedidos = await this.pedidosModel.selectByFornecedor(fornecedorId);
    return new DefaultResponseDto(true, "Pedidos recuperados com sucesso", pedidos);
  }
}

module.exports = PedidosService;
