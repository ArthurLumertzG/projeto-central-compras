const StoresService = require("../services/storeServices");
const storesService = new StoresService();

class StoresController {
  async getAll(req, res) {
    const response = await storesService.getAll();
    res.status(200).json(response);
  }

  async getById(req, res) {
    const { id } = req.params;
    const response = await storesService.getById(id);
    res.status(200).json(response);
  }

  async create(req, res) {
    const store = req.body;
    const response = await storesService.create(store);
    res.status(201).json(response);
  }

  async update(req, res) {
    const { id } = req.params;
    const store = req.body;
    const response = await storesService.update(id, store);
    res.status(200).json(response);
  }

  async delete(req, res) {
    const { id } = req.params;
    const response = await storesService.delete(id);
    res.status(200).json(response);
  }
}

module.exports = new StoresController();
