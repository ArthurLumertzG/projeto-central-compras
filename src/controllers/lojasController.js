const LojasService = require("../services/lojasService");

class LojasController {
  constructor() {
    this.lojasService = new LojasService();
  }

  async getAll(req, res) {
    const result = await this.lojasService.getAll();
    res.status(200).json(result);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await this.lojasService.getById(id);
    res.status(200).json(result);
  }

  async getMinhasLojas(req, res) {
    const result = await this.lojasService.getByUsuarioId(req.user.id);
    res.status(200).json(result);
  }

  async getByUsuarioId(req, res) {
    const { usuario_id } = req.params;
    const result = await this.lojasService.getByUsuarioId(usuario_id);
    res.status(200).json(result);
  }

  async create(req, res) {
    const result = await this.lojasService.create(req.body);
    res.status(201).json(result);
  }

  async update(req, res) {
    const { id } = req.params;
    const result = await this.lojasService.update(id, req.body, req.user.id, req.user.funcao);
    res.status(200).json(result);
  }

  async delete(req, res) {
    const { id } = req.params;
    const result = await this.lojasService.delete(id, req.user.id, req.user.funcao);
    res.status(200).json(result);
  }
}

module.exports = LojasController;
