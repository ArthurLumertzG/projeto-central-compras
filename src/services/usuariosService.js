const UsuariosModel = require("../models/usuariosModel");
const EnderecosService = require("./enderecosService");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Joi = require("joi");
const { createUsuarioSchema, loginSchema, updateUsuarioSchema, updatePasswordSchema, uuidSchema } = require("../validations/usuarioValidation");

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;

class UsuariosService {
  constructor() {
    this.usuariosModel = new UsuariosModel();
    this.enderecosService = new EnderecosService();
  }

  async login(email, senha) {
    const { error, value } = loginSchema.validate({ email, senha });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { email: emailValidado, senha: senhaValidada } = value;

    const usuario = await this.usuariosModel.selectByEmail(emailValidado);
    if (!usuario) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const passwordMatch = await bcrypt.compare(senhaValidada, usuario.senha);
    if (!passwordMatch) {
      throw new AppError("Credenciais inválidas", 401);
    }

    if (!usuario.email_verificado) {
      throw new AppError("Email não verificado. Verifique seu email antes de fazer login.", 403);
    }

    const jwtPayload = this.createJwtPayload(usuario);
    const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "24h" });

    return new DefaultResponseDto(true, "Login realizado com sucesso", {
      token,
    });
  }

  async getAll() {
    const usuarios = await this.usuariosModel.select();
    if (!usuarios || usuarios.length === 0) {
      return new DefaultResponseDto(true, "Nenhum usuário encontrado", []);
    }

    const usuariosWithoutPasswords = usuarios.map(({ senha, ...rest }) => rest);

    return new DefaultResponseDto(true, "Usuários encontrados com sucesso", usuariosWithoutPasswords);
  }

  async getById(id, requestUserId = null) {
    const { error } = uuidSchema.validate(id);
    if (error) {
      throw new AppError("ID inválido", 400);
    }

    const usuario = await this.usuariosModel.selectById(id);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const { senha, ...usuarioWithoutPassword } = usuario;

    return new DefaultResponseDto(true, "Usuário encontrado com sucesso", usuarioWithoutPassword);
  }

  async getByEmail(email) {
    const { error, value } = Joi.string().email().required().validate(email);
    if (error) {
      throw new AppError("Email inválido", 400);
    }

    const usuario = await this.usuariosModel.selectByEmail(value.toLowerCase());
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const { senha, ...usuarioWithoutPassword } = usuario;

    return new DefaultResponseDto(true, "Usuário encontrado com sucesso", usuarioWithoutPassword);
  }

  async create(usuarioData) {
    const { error, value } = createUsuarioSchema.validate(usuarioData);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { email, senha, confirmedPassword, endereco_id, ...restData } = value;

    const existingUsuario = await this.usuariosModel.selectByEmail(email);
    if (existingUsuario) {
      throw new AppError("Já existe um usuário com este email", 409);
    }

    if (endereco_id) {
      const enderecoExists = await this.enderecosService.exists(endereco_id);
      if (!enderecoExists) {
        throw new AppError("Endereço não encontrado. Crie o endereço primeiro antes de criar o usuário.", 404);
      }
    }

    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    const newUsuario = {
      ...restData,
      email,
      senha: hashedPassword,
      endereco_id: endereco_id || null,
      email_verificado: true
    };

    const createdUsuario = await this.usuariosModel.create(newUsuario);

    const jwtPayload = this.createJwtPayload(createdUsuario);
    const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "24h" });

    return new DefaultResponseDto(true, "Usuário criado com sucesso", {
      token,
    });
  }

  async update(id, updateData, requestUserId, userFuncao) {
    const { error: idError } = uuidSchema.validate(id);
    if (idError) {
      throw new AppError("ID inválido", 400);
    }

    if (!requestUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const originalUsuario = await this.usuariosModel.selectById(id);
    if (!originalUsuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    // Admin pode atualizar qualquer usuário
    if (userFuncao !== "admin" && id !== requestUserId) {
      throw new AppError("Você não tem permissão para atualizar este usuário", 403);
    }

    const { error, value } = updateUsuarioSchema.validate(updateData);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    if (value.email && value.email !== originalUsuario.email) {
      const emailExists = await this.usuariosModel.selectByEmail(value.email);
      if (emailExists) {
        throw new AppError("Este email já está em uso", 409);
      }
      value.email_verificado = false;
    }

    if (value.endereco_id) {
      const enderecoExists = await this.enderecosService.exists(value.endereco_id);
      if (!enderecoExists) {
        throw new AppError("Endereço não encontrado. Crie ou use um endereço válido.", 404);
      }
    }

    value.atualizado_em = new Date();

    const updatedUsuario = await this.usuariosModel.update(id, value);
    if (!updatedUsuario) {
      throw new AppError("Erro ao atualizar usuário", 500);
    }

    const { senha, ...usuarioWithoutPassword } = updatedUsuario;

    const jwtPayload = this.createJwtPayload(updatedUsuario);
    const newToken = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "24h" });

    return new DefaultResponseDto(
      true,
      "Usuário atualizado com sucesso",
      {
        usuario: usuarioWithoutPassword,
        token: newToken,
      },
      usuarioWithoutPassword
    );
  }

  async updatePassword(id, passwordData, requestUserId) {
    const { error: idError } = uuidSchema.validate(id);
    if (idError) {
      throw new AppError("ID inválido", 400);
    }

    if (!requestUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    if (id !== requestUserId) {
      throw new AppError("Você não tem permissão para alterar a senha deste usuário", 403);
    }

    const { error, value } = updatePasswordSchema.validate(passwordData);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const usuario = await this.usuariosModel.selectById(id);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const senhaAtual = value.senhaAtual.trim();
    const passwordMatch = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!passwordMatch) {
      throw new AppError("Senha atual incorreta", 401);
    }

    const hashedPassword = await bcrypt.hash(value.novaSenha.trim(), SALT_ROUNDS);

    await this.usuariosModel.update(id, {
      senha: hashedPassword
    });

    return new DefaultResponseDto(true, "Senha atualizada com sucesso", null);
  }

  async delete(id, requestUserId, userFuncao) {
    const { error: idError } = uuidSchema.validate(id);
    if (idError) {
      throw new AppError("ID inválido", 400);
    }

    if (!requestUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const usuario = await this.usuariosModel.selectById(id);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (userFuncao !== "admin" && id !== requestUserId) {
      throw new AppError("Você não tem permissão para deletar este usuário", 403);
    }

    const usuarioIsDeleted = await this.usuariosModel.delete(id);
    if (!usuarioIsDeleted) {
      throw new AppError("Erro ao deletar usuário", 500);
    }

    return new DefaultResponseDto(true, "Usuário deletado com sucesso", null);
  }

  createJwtPayload(usuario) {
    return {
      sub: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      funcao: usuario.funcao,
      email_verificado: usuario.email_verificado,
      iat: Math.floor(Date.now() / 1000),
    };
  }
}

module.exports = UsuariosService;
