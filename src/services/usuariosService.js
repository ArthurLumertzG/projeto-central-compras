const UsuariosModel = require("../models/usuariosModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { validateUsuario } = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const { v4: uuidv4 } = require("uuid");
const jwtSecret = process.env.JWT_SECRET;

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

    if (usuario.status !== "on") {
      throw new AppError("Usuário inativo. Contate o administrador.", 403);
    }

    const jwtPayload = this.createJwtPayload(usuario);

    const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "1h" });

    return new DefaultResponseDto(true, "Login realizado com sucesso", { token });
  }

  async getAll() {
    const usuarios = await this.usuariosModel.select();
    if (!usuarios || usuarios.length === 0) {
      return new DefaultResponseDto(true, "Nenhum usuário encontrado", []);
    }

    const usuariosWithoutPasswords = usuarios.map(({ password, ...rest }) => rest);

    return new DefaultResponseDto(true, "Usuários encontrados com sucesso", usuariosWithoutPasswords);
  }

  async getById(id) {
    const usuario = await this.usuariosModel.selectById(id);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const { password, ...usuarioWithoutPassword } = usuario;

    return new DefaultResponseDto(true, "Usuário encontrado com sucesso", usuarioWithoutPassword);
  }

  async getByEmail(email) {
    const usuario = await this.usuariosModel.selectByEmail(email);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const { password, ...usuarioWithoutPassword } = usuario;

    return new DefaultResponseDto(true, "Usuário encontrado com sucesso", usuarioWithoutPassword);
  }

  async create(usuario) {
    const usuarioError = validateUsuario(usuario);
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

    const { confirmedPassword, ...restUsuario } = usuario;
    const newUsuario = {
      id: newId,
      ...restUsuario,
      password: hashedPassword,
    };

    const createdUsuario = await this.usuariosModel.create(newUsuario);

    const jwtPayload = this.createJwtPayload(createdUsuario);

    const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "1h" });

    return new DefaultResponseDto(true, "Usuário criado com sucesso", { token });
  }

  async update(id, usuario) {
    const originalUsuario = await this.usuariosModel.selectById(id);
    if (!originalUsuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (originalUsuario.id !== usuario.id) {
      throw new AppError("Não é permitido alterar o ID do usuário", 403);
    }

    if (originalUsuario.level === "user" && usuario.level === "admin") {
      throw new AppError("Usuário comum não pode se tornar admin", 403);
    }

    if (usuario.email && usuario.email !== originalUsuario.email) {
      const emailExists = await this.usuariosModel.selectByEmail(usuario.email);
      if (emailExists) throw new AppError("Email já cadastrado", 409);
    }

    if (usuario.password) {
      if (usuario.password.length < 6) {
        throw new AppError("A senha deve ter pelo menos 6 caracteres", 400);
      }

      if (usuario.password !== usuario.confirmedPassword) {
        throw new AppError("As senhas não coincidem", 400);
      }

      const saltRounds = 10;
      usuario.password = await bcrypt.hash(usuario.password, saltRounds);
    }

    const { confirmedPassword, ...updateFields } = usuario;

    const updatedUsuario = await this.usuariosModel.update(id, updateFields);
    if (!updatedUsuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const { password, ...usuarioWithoutPassword } = updatedUsuario;
    return new DefaultResponseDto(true, "Usuário atualizado com sucesso", usuarioWithoutPassword);
  }

  async delete(id) {
    const usuarioIsDeleted = await this.usuariosModel.delete(id);
    if (!usuarioIsDeleted) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return new DefaultResponseDto(true, "Usuário deletado com sucesso", null);
  }

  createJwtPayload(usuario) {
    return {
      sub: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      level: usuario.level,
      status: usuario.status,
    };
  }
}

module.exports = UsuariosService;
