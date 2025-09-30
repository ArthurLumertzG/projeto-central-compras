const CampanhasService = require("../services/campanhasService");
const campanhasService = new CampanhasService();

class CampanhasController {
  async getAll(req, res) {
    const response = await campanhasService.getAll();
    res.status(200).json(response);
  }

  async getById(req, res) {
    const { id } = req.params;
    const response = await campanhasService.getById(id);
    res.status(200).json(response);
  }

  async create(req, res) {
    const campanha = req.body;
    const response = await campanhasService.create(campanha);
    res.status(201).json(response);
  }

  async update(req, res) {
    const { id } = req.params;
    const campanha = req.body;
    const response = await campanhasService.update(id, campanha);
    res.status(200).json(response);
  }

  async delete(req, res) {
    const { id } = req.params;
    const response = await campanhasService.delete(id);
    res.status(200).json(response);
  }
}

module.exports = new CampanhasController();
