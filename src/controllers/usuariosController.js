const UsuariosService = require("../services/usuariosService");
const usuariosService = new UsuariosService();

class UsuariosController {
  /**
   * Login do usuário
   * @route POST /api/usuarios/login
   * @access Public
   */
  async login(req, res) {
    const { email, senha } = req.body;
    const response = await usuariosService.login(email, senha);
    res.status(200).json(response);
  }

  /**
   * Lista todos os usuários
   * @route GET /api/usuarios
   * @access Private
   */
  async getAll(req, res) {
    const response = await usuariosService.getAll();
    res.status(200).json(response);
  }

  /**
   * Busca usuário por ID
   * @route GET /api/usuarios/:id
   * @access Private
   */
  async getById(req, res) {
    const { id } = req.params;
    // Passa o ID do usuário autenticado (disponível após middleware authenticate)
    const requestUserId = req.user ? req.user.id : null;
    const response = await usuariosService.getById(id, requestUserId);
    res.status(200).json(response);
  }

  /**
   * Busca usuário por email
   * @route GET /api/usuarios/email/:email
   * @access Private
   */
  async getByEmail(req, res) {
    const { email } = req.params;
    const response = await usuariosService.getByEmail(email);
    res.status(200).json(response);
  }

  /**
   * Cria novo usuário (cadastro)
   * @route POST /api/usuarios/cadastro
   * @access Public
   */
  async create(req, res) {
    const usuario = req.body;
    const response = await usuariosService.create(usuario);
    res.status(201).json(response);
  }

  /**
   * Atualiza dados do usuário
   * @route PATCH /api/usuarios/:id
   * @access Private (apenas o próprio usuário)
   */
  async update(req, res) {
    const { id } = req.params;
    const usuario = req.body;
    // Passa o ID do usuário autenticado para validação de segurança
    const requestUserId = req.user.id;
    const response = await usuariosService.update(id, usuario, requestUserId);
    res.status(200).json(response);
  }

  /**
   * Atualiza senha do usuário
   * @route PUT /api/usuarios/:id/senha
   * @access Private (apenas o próprio usuário)
   */
  async updatePassword(req, res) {
    const { id } = req.params;
    const passwordData = req.body;
    // Passa o ID do usuário autenticado para validação de segurança
    const requestUserId = req.user.id;
    const response = await usuariosService.updatePassword(
      id,
      passwordData,
      requestUserId,
    );
    res.status(200).json(response);
  }

  /**
   * Deleta usuário (soft delete)
   * @route DELETE /api/usuarios/:id
   * @access Private (apenas o próprio usuário)
   */
  async delete(req, res) {
    const { id } = req.params;
    // Passa o ID do usuário autenticado para validação de segurança
    const requestUserId = req.user.id;
    const response = await usuariosService.delete(id, requestUserId);
    res.status(200).json(response);
  }
}

module.exports = new UsuariosController();
