const UsuariosModel = require("../models/usuariosModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const process = require("process");
const { validadeUsuario } = require("../utils/validator");

const { v4: uuidv4 } = require("uuid");

class UsuariosService {
  constructor() {
    this.usuariosModel = new UsuariosModel();
  }

  async login(email, password) {
    const emailLower = email.toLowerCase();
    const usuario = await this.usuariosModel.selectByEmail(emailLower);
    if (!usuario) {
      throw new AppError("Usuário ou senha inválidos", 401);
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      throw new AppError("Usuário ou senha inválidos", 401);
    }

    const token = jwt.sign({ sub: usuario.id, email: usuario.email, level: usuario.level, status: usuario.status }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return new DefaultResponseDto(true, "Login realizado com sucesso", token);
  }

  async getAll() {
    const usuarios = await this.usuariosModel.select();
    if (!usuarios || usuarios.length === 0) {
      return new DefaultResponseDto(true, "Nenhum usuário encontrado", []);
    }

    return new DefaultResponseDto(true, "Usuários encontrados com sucesso", usuarios);
  }

  async getById(id) {
    const usuario = await this.usuariosModel.selectById(id);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return new DefaultResponseDto(true, "Usuário encontrado com sucesso", usuario);
  }

  async getByEmail(email) {
    const usuario = await this.usuariosModel.selectByEmail(email);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return new DefaultResponseDto(true, "Usuário encontrado com sucesso", usuario);
  }

  async create(usuario) {
    const usuarioError = validadeUsuario(usuario);
    if (usuarioError) throw new AppError(usuarioError, 400);

    usuario.email = usuario.email.toLowerCase();
    const { email } = usuario;
    const existingUsuario = await this.usuariosModel.selectByEmail(email);

    if (existingUsuario) {
      throw new AppError("Já existe um usuário com este email", 409);
    }

    const newId = uuidv4();
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(usuario.password, saltRounds);

    const newUsuario = {
      id: newId,
      password: hashedPassword,
      ...usuario,
    };

    const createdUsuario = await this.usuariosModel.create(newUsuario);

    const token = jwt.sign({ sub: createdUsuario.id, email: createdUsuario.email, level: createdUsuario.level, status: createdUsuario.status }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return new DefaultResponseDto(true, "Usuário criado com sucesso", token);
  }

  async update(id, usuario) {
    const updatedUsuario = await this.usuariosModel.update(id, usuario);
    if (!updatedUsuario) {
      throw new AppError(`Usuário não encontrado`, 404);
    }

    return new DefaultResponseDto(true, "Usuário atualizado com sucesso", updatedUsuario);
  }

  async delete(id) {
    const usuarioIsDeleted = await this.usuariosModel.delete(id);
    if (!usuarioIsDeleted) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return new DefaultResponseDto(true, "Usuário deletado com sucesso", null);
  }
}

module.exports = UsuariosService;
