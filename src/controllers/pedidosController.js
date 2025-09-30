const PedidosService = require("../services/pedidosService");
const pedidosService = new PedidosService();

class PedidosController {
    async getAll(req, res) {
        const response = await pedidosService.getAll();
        res.status(200).json(response);
    }

    async getById(req, res) {
        const { id } = req.params;
        const response = await pedidosService.getById(id);
        res.status(200).json(response);
    }

    async getByDate(req, res) {
        const { date } = req.query;
        const response = await pedidosService.getByDate(date);
        res.status(200).json(response);
    }

    async create(req, res) {
        const pedido = req.body;
        const response = await pedidosService.create(pedido);
        res.status(201).json(response);
    }

    async update(req, res) {
        const { id } = req.params;
        const pedido = req.body;
        const response = await pedidosService.update(id, pedido);
        res.status(200).json(response);
    }

    async delete(req, res) {
        const { id } = req.params;
        const response = await pedidosService.delete(id);
        res.status(200).json(response);
    }
}

module.exports = new PedidosController();
