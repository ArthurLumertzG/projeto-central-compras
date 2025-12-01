const AppError = require("../errors/AppError");

/**
 * Middleware para verificar se o usuário autenticado é um fornecedor
 * Deve ser usado após o middleware de autenticação (authenticate)
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função para passar para o próximo middleware
 * @throws {AppError} 403 se o usuário não for fornecedor
 */
const supplierAuth = (req, res, next) => {
  // Verifica se o usuário está autenticado (deve vir do middleware authenticate)
  if (!req.userId) {
    throw new AppError("Usuário não autenticado", 401);
  }

  // Verifica se o usuário tem função de fornecedor
  if (!req.userFuncao) {
    throw new AppError("Função do usuário não identificada", 401);
  }

  if (req.userFuncao !== "fornecedor") {
    throw new AppError("Acesso negado. Apenas fornecedores podem acessar este recurso", 403);
  }

  next();
};

module.exports = { supplierAuth };
