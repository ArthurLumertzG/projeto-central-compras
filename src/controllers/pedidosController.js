const PedidosService = require("../services/pedidosService");

class PedidosController {
  constructor() {
    this.pedidosService = new PedidosService();
  }

  async getAll(req, res) {
    const response = await this.pedidosService.getAll();
    res.status(200).json(response);
  }

  async getById(req, res) {
    const { id } = req.params;
    const response = await this.pedidosService.getById(id);
    res.status(200).json(response);
  }

  async getByStatus(req, res) {
    const { status } = req.params;
    const response = await this.pedidosService.getByStatus(status);
    res.status(200).json(response);
  }

  async getMeusPedidos(req, res) {
    const response = await this.pedidosService.getByUsuarioId(req.user.id);
    res.status(200).json(response);
  }

  async getByDate(req, res) {
    const { date } = req.query;
    const response = await this.pedidosService.getByDate(date);
    res.status(200).json(response);
  }

  async create(req, res) {
    const response = await this.pedidosService.create(req.body, req.user.id);
    res.status(201).json(response);
  }

  async update(req, res) {
    const { id } = req.params;
    const response = await this.pedidosService.update(id, req.body, req.userId);
    res.status(200).json(response);
  }

  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const fornecedorId = req.user.fornecedorId;
    
    const response = await this.pedidosService.updateStatus(id, status, fornecedorId);
    res.status(200).json(response);
  }

  async delete(req, res) {
    const { id } = req.params;
    const response = await this.pedidosService.delete(id, req.userId);
    res.status(200).json(response);
  }
}

module.exports = new PedidosController();
