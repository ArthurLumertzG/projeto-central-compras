const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");
const dotenv = require("dotenv");

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não fornecido", 401);
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      throw new AppError("Formato de token inválido", 401);
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      throw new AppError("Token mal formatado", 401);
    }

    const decoded = jwt.verify(token, jwtSecret);

    req.user = {
      id: decoded.sub,
      nome: decoded.nome,
      sobrenome: decoded.sobrenome,
      email: decoded.email,
      funcao: decoded.funcao,
      email_verificado: decoded.email_verificado,
    };

    req.userId = decoded.sub;
    req.userFuncao = decoded.funcao;

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expirado", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Token inválido", 401));
    }

    return next(new AppError("Erro na autenticação", 401));
  }
};

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
    return next();
  }
};

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
