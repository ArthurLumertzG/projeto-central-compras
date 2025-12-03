const UsuariosService = require("../services/usuariosService");
const usuariosService = new UsuariosService();

class UsuariosController {
  async login(req, res) {
    const { email, senha } = req.body;
    const response = await usuariosService.login(email, senha);
    res.status(200).json(response);
  }

  async getAll(req, res) {
    const response = await usuariosService.getAll();
    res.status(200).json(response);
  }

  async getById(req, res) {
    const { id } = req.params;
    const requestUserId = req.user ? req.user.id : null;
    const response = await usuariosService.getById(id, requestUserId);
    res.status(200).json(response);
  }

  async getByEmail(req, res) {
    const { email } = req.params;
    const response = await usuariosService.getByEmail(email);
    res.status(200).json(response);
  }

  async create(req, res) {
    const usuario = req.body;
    const response = await usuariosService.create(usuario);
    res.status(201).json(response);
  }

  async update(req, res) {
    const { id } = req.params;
    const usuario = req.body;
    const requestUserId = req.user.id;
    const userFuncao = req.user.funcao;
    const response = await usuariosService.update(id, usuario, requestUserId, userFuncao);
    res.status(200).json(response);
  }

  async updatePassword(req, res) {
    const { id } = req.params;
    const passwordData = req.body;
    const requestUserId = req.user.id;
    const response = await usuariosService.updatePassword(id, passwordData, requestUserId);
    res.status(200).json(response);
  }

  async delete(req, res) {
    const { id } = req.params;
    const requestUserId = req.user.id;
    const userFuncao = req.user.funcao;
    const response = await usuariosService.delete(id, requestUserId, userFuncao);
    res.status(200).json(response);
  }
}

module.exports = new UsuariosController();
