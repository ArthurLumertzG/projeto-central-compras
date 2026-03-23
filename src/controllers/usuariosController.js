const UsuariosService = require("../services/usuariosService");
const usuariosService = new UsuariosService();

const isProduction = process.env.NODE_ENV === "production";
const authCookieName = process.env.AUTH_COOKIE_NAME || "auth_token";
const authCookieMaxAgeMs = Number(process.env.AUTH_COOKIE_MAX_AGE_MS || 2 * 60 * 60 * 1000);
const authCookieSameSite = process.env.AUTH_COOKIE_SAMESITE || "lax";

const setAuthCookie = (res, token) => {
  res.cookie(authCookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: authCookieSameSite,
    path: "/",
    maxAge: authCookieMaxAgeMs,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(authCookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: authCookieSameSite,
    path: "/",
  });
};

class UsuariosController {
  async login(req, res) {
    const { email, senha } = req.body;
    const response = await usuariosService.login(email, senha);
    setAuthCookie(res, response.data.token);
    response.data = { user: response.data.user };
    res.status(200).json(response);
  }

  async getAll(req, res) {
    const response = await usuariosService.getAll(req.user.funcao);
    res.status(200).json(response);
  }

  async getById(req, res) {
    const { id } = req.params;
    const response = await usuariosService.getById(id, req.user.id, req.user.funcao);
    res.status(200).json(response);
  }

  async getByEmail(req, res) {
    const { email } = req.params;
    const response = await usuariosService.getByEmail(email, req.user.funcao);
    res.status(200).json(response);
  }

  async getMe(req, res) {
    const response = await usuariosService.getById(req.user.id, req.user.id, req.user.funcao);
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

  async logout(req, res) {
    clearAuthCookie(res);

    res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso",
      data: null,
    });
  }
}

module.exports = new UsuariosController();
