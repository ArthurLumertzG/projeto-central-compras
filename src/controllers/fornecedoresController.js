const FornecedoresService = require("../services/fornecedoresService");
const fornecedoresService = new FornecedoresService();

class FornecedoresController {
  async getAll(req, res) {
    const response = await fornecedoresService.getAll();
    res.status(200).json(response);
  }

  async getById(req, res) {
    const { id } = req.params;
    const response = await fornecedoresService.getById(id);
    res.status(200).json(response);
  }

  async create(req, res) {
    const fornecedor = req.body;
    const response = await fornecedoresService.create(fornecedor);
    res.status(201).json(response);
  }

  async update(req, res) {
    const { id } = req.params;
    const fornecedor = req.body;
    const response = await fornecedoresService.update(id, fornecedor);
    res.status(200).json(response);
  }

  async delete(req, res) {
    const { id } = req.params;
    const response = await fornecedoresService.delete(id);
    res.status(200).json(response);
  }
}

module.exports = new FornecedoresController();
