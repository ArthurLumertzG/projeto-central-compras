const PedidosModel = require("../models/pedidosModel");
const AppError = require("../errors/AppError");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const pedidosModel = new PedidosModel();

const { v4: uuidv4 } = require("uuid");

class PedidosService {
  constructor() {}

  async getAll() {
    const data = await pedidosModel.select();
    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", data);
  }

  async getById(id) {
    const pedido = await pedidosModel.selectById(id);
    if (!pedido) throw new AppError("Pedido não encontrado", 404);
    return new DefaultResponseDto(true, "Pedido encontrado com sucesso", pedido);
  }

  async getByDate(date) {
    const pedidos = await pedidosModel.selectByDate(date);
    if (!pedidos || pedidos.length === 0) {
      throw new AppError("Nenhum pedido encontrado para a data informada", 404);
    }
    return new DefaultResponseDto(true, "Pedidos encontrados com sucesso", pedidos);
  }

  async create(pedido) {
    const pedidos = await pedidosModel.select();

    const newId = uuidv4();

    const newPedido = {
      id: newId,
      ...pedido,
      date: pedido.date || new Date().toISOString(),
    };

    pedidos.push(newPedido);
    await pedidosModel.create(newPedido);
    return new DefaultResponseDto(true, "Pedido criado com sucesso", newPedido);
  }

  async update(id, updateData) {
    const pedido = await pedidosModel.selectById(id);
    if (!pedido) throw new AppError("Pedido não encontrado", 404);

    const updatedPedido = {
      ...pedido,
      ...updateData,
    };

    await pedidosModel.update(id, updatedPedido);
    return new DefaultResponseDto(true, "Pedido atualizado com sucesso", updatedPedido);
  }

  async delete(id) {
    const pedido = await pedidosModel.selectById(id);
    if (!pedido) throw new AppError("Pedido não encontrado", 404);

    await pedidosModel.delete(id);
    return new DefaultResponseDto(true, "Pedido deletado com sucesso", pedido);
  }
}

module.exports = PedidosService;
