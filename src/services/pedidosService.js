const PedidosModel = require("../models/pedidosModel");
const PedidoProdutoModel = require("../models/pedidoProdutoModel");
const ProdutosModel = require("../models/produtosModel");
const LojasModel = require("../models/lojasModel");
const FornecedoresModel = require("../models/fornecedoresModel");
const AppError = require("../errors/AppError");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const { createPedidoSchema, updatePedidoSchema, uuidSchema, statusSchema, dateSchema } = require("../validations/pedidoValidation");

class PedidosService {
  constructor() {
    this.pedidosModel = new PedidosModel();
    this.pedidoProdutoModel = new PedidoProdutoModel();
    this.produtosModel = new ProdutosModel();
    this.lojasModel = new LojasModel();
    this.fornecedoresModel = new FornecedoresModel();
  }

  async getAll() {
    const pedidos = await this.pedidosModel.select();

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum pedido encontrado", []);
    }

    const pedidosComItens = await Promise.all(
      pedidos.map(async (pedido) => {
        const itens = await this.pedidoProdutoModel.selectByPedidoId(pedido.id);
        const { loja_id, fornecedor_id, ...pedidoData } = pedido;

        let fornecedorNome = null;
        if (fornecedor_id) {
          try {
            const fornecedor = await this.fornecedoresModel.selectById(fornecedor_id);
            fornecedorNome = fornecedor?.nome_fantasia || fornecedor?.razao_social || null;
          } catch (error) {
            console.error("Erro ao buscar fornecedor:", error);
          }
        }

        return {
          ...pedidoData,
          loja: loja_id,
          fornecedor_nome: fornecedorNome,
          itens: itens,
        };
      })
    );

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidosComItens);
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

    const { loja_id, ...pedidoData } = pedido;
    const pedidoCompleto = {
      ...pedidoData,
      loja: loja_id,
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

    const pedidosComItens = await Promise.all(
      pedidos.map(async (pedido) => {
        const itens = await this.pedidoProdutoModel.selectByPedidoId(pedido.id);
        const { loja_id, ...pedidoData } = pedido;
        return {
          ...pedidoData,
          loja: loja_id,
          itens: itens,
        };
      })
    );

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidosComItens);
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

    const pedidosComItens = await Promise.all(
      pedidos.map(async (pedido) => {
        const itens = await this.pedidoProdutoModel.selectByPedidoId(pedido.id);
        const { loja_id, ...pedidoData } = pedido;
        return {
          ...pedidoData,
          loja: loja_id,
          itens: itens,
        };
      })
    );

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidosComItens);
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

    const pedidosComItens = await Promise.all(
      pedidos.map(async (pedido) => {
        const itens = await this.pedidoProdutoModel.selectByPedidoId(pedido.id);
        return {
          ...pedido,
          itens: itens,
        };
      })
    );

    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidosComItens);
  }

  async create(data, requestUserId) {
    const loja = await this.lojasModel.selectByUsuarioId(requestUserId);
    if (!loja[0]) {
      throw new AppError("Loja não encontrada para o usuário logado", 404);
    }

    const pedidoData = {
      ...data,
      loja_id: loja[0].id,
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

      if (produto.fornecedor_id.toString() !== value.fornecedor_id.toString()) {
        throw new AppError(`Todos os produtos do pedido devem ser do mesmo fornecedor`, 400);
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

    const novoPedido = {
      valor_total: valorTotalCalculado,
      descricao: value.descricao || null,
      usuario_id: requestUserId,
      loja_id: loja[0].id,
      fornecedor_id: value.fornecedor_id,
      status: value.status || "pendente",
      forma_pagamento: value.forma_pagamento,
      prazo_dias: value.prazo_dias,
    };

    const pedidoCriado = await this.pedidosModel.create(novoPedido);

    const itensCriados = [];

    for (const itemData of produtosData) {
      const novoItem = {
        pedido_id: pedidoCriado.id,
        produto_id: itemData.produto_id,
        quantidade: itemData.quantidade,
        valor_unitario: itemData.valor_unitario,
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

    if (requestUserId && pedidoExists.usuario_id.toString() !== requestUserId.toString()) {
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

  async updateStatus(id, status, fornecedorId) {
    const { error: idError } = uuidSchema.validate(id);
    if (idError) {
      throw new AppError(idError.details[0].message, 400);
    }

    const { error: statusError } = statusSchema.validate(status);
    if (statusError) {
      throw new AppError(statusError.details[0].message, 400);
    }

    const pedido = await this.pedidosModel.selectById(id);
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404);
    }

    if (pedido.fornecedor_id.toString() !== fornecedorId.toString()) {
      throw new AppError("Você não tem permissão para atualizar este pedido", 403);
    }

    if (pedido.status === "entregue" || pedido.status === "cancelado") {
      throw new AppError(`Pedido já está ${pedido.status} e não pode ser atualizado`, 409);
    }

    const validTransitions = {
      pendente: ["processando", "cancelado"],
      processando: ["enviado", "cancelado"],
      enviado: ["entregue"],
    };

    const allowedStatuses = validTransitions[pedido.status] || [];
    if (!allowedStatuses.includes(status)) {
      throw new AppError(`Transição de '${pedido.status}' para '${status}' não é permitida`, 400);
    }

    const updateData = { status };

    if (status === "enviado") {
      updateData.enviado_em = new Date();
    } else if (status === "entregue") {
      updateData.entregue_em = new Date();
    }

    const pedidoAtualizado = await this.pedidosModel.update(id, updateData);

    return new DefaultResponseDto(true, "Status do pedido atualizado com sucesso", pedidoAtualizado);
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

    if (requestUserId && pedidoExists.usuario_id.toString() !== requestUserId.toString()) {
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

    if (!pedidos || pedidos.length === 0) {
      return new DefaultResponseDto(true, "Nenhum pedido encontrado para este fornecedor", []);
    }

    const pedidosComItens = await Promise.all(
      pedidos.map(async (pedido) => {
        const itens = await this.pedidoProdutoModel.selectByPedidoId(pedido.id);
        return {
          ...pedido,
          itens: itens,
        };
      })
    );

    return new DefaultResponseDto(true, "Pedidos recuperados com sucesso", pedidosComItens);
  }
}

module.exports = PedidosService;
