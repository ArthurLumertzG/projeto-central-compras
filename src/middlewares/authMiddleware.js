const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");
const dotenv = require("dotenv");

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

/**
 * Middleware de autenticação
 * Valida o token JWT e adiciona os dados do usuário na requisição
 */
const authenticate = (req, res, next) => {
  try {
    // Extrai o token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não fornecido", 401);
    }

    // Formato esperado: "Bearer <token>"
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      throw new AppError("Formato de token inválido", 401);
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      throw new AppError("Token mal formatado", 401);
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, jwtSecret);

    // Adiciona informações do usuário na requisição
    req.user = {
      id: decoded.sub,
      nome: decoded.nome,
      sobrenome: decoded.sobrenome,
      email: decoded.email,
      funcao: decoded.funcao,
      email_verificado: decoded.email_verificado,
    };

    // Adiciona também diretamente no req para fácil acesso
    req.userId = decoded.sub;
    req.userFuncao = decoded.funcao;

    return next();
  } catch (error) {
    // Se for um AppError, repassa; senão, cria um novo
    if (error instanceof AppError) {
      return next(error);
    }

    // Erros específicos do JWT
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expirado", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Token inválido", 401));
    }

    // Erro genérico
    return next(new AppError("Erro na autenticação", 401));
  }
};

/**
 * Middleware opcional de autenticação
 * Tenta autenticar, mas permite a requisição mesmo sem token
 */
const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return next();
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return next();
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (!err) {
        req.user = {
          id: decoded.sub,
          nome: decoded.nome,
          sobrenome: decoded.sobrenome,
          email: decoded.email,
          funcao: decoded.funcao,
          email_verificado: decoded.email_verificado,
        };
      }
      return next();
    });
  } catch (error) {
    // Em caso de erro, apenas continua sem autenticar
    return next();
  }
};

/**
 * Middleware para verificar se o email foi verificado
 * DEVE ser usado APÓS o middleware authenticate
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    throw new AppError("Usuário não autenticado", 401);
  }

  if (!req.user.email_verificado) {
    throw new AppError("Email não verificado. Verifique seu email antes de continuar.", 403);
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  requireEmailVerified,
};
