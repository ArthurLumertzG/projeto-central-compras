const UsuariosModel = require("../models/usuariosModel");
const EnderecosService = require("./enderecosService");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const { createUsuarioSchema, loginSchema, updateUsuarioSchema, updatePasswordSchema, uuidSchema } = require("../validations/usuarioValidation");

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const SALT_ROUNDS = 12; // Aumentado para maior segurança

class UsuariosService {
  constructor() {
    this.usuariosModel = new UsuariosModel();
    this.enderecosService = new EnderecosService();
  }

  /**
   * Realiza login do usuário
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise<DefaultResponseDto>} Token JWT
   */
  async login(email, senha) {
    // Validação dos dados de entrada
    const { error, value } = loginSchema.validate({ email, senha });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { email: emailValidado, senha: senhaValidada } = value;

    // Busca usuário por email
    const usuario = await this.usuariosModel.selectByEmail(emailValidado);
    if (!usuario) {
      // Mensagem genérica para evitar enumeração de usuários
      throw new AppError("Credenciais inválidas", 401);
    }

    // Verifica senha
    const passwordMatch = await bcrypt.compare(senhaValidada, usuario.senha);
    if (!passwordMatch) {
      throw new AppError("Credenciais inválidas", 401);
    }

    // Verifica se email foi verificado
    if (!usuario.email_verificado) {
      throw new AppError("Email não verificado. Verifique seu email antes de fazer login.", 403);
    }

    const jwtPayload = this.createJwtPayload(usuario);
    const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "24h" });

    return new DefaultResponseDto(true, "Login realizado com sucesso", { token });
  }

  /**
   * Retorna todos os usuários (sem senhas)
   * @returns {Promise<DefaultResponseDto>} Lista de usuários
   */
  async getAll() {
    const usuarios = await this.usuariosModel.select();
    if (!usuarios || usuarios.length === 0) {
      return new DefaultResponseDto(true, "Nenhum usuário encontrado", []);
    }

    // Remove senhas de todos os usuários
    const usuariosWithoutPasswords = usuarios.map(({ senha, ...rest }) => rest);

    return new DefaultResponseDto(true, "Usuários encontrados com sucesso", usuariosWithoutPasswords);
  }

  /**
   * Busca usuário por ID
   * @param {string} id - ID do usuário
   * @param {string} requestUserId - ID do usuário que está fazendo a requisição (para autorização futura)
   * @returns {Promise<DefaultResponseDto>} Dados do usuário sem senha
   */
  async getById(id, requestUserId = null) {
    // Validação do ID
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

  /**
   * Busca usuário por email
   * @param {string} email - Email do usuário
   * @returns {Promise<DefaultResponseDto>} Dados do usuário sem senha
   */
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

  /**
   * Cria um novo usuário
   * @param {Object} usuarioData - Dados do novo usuário
   * @returns {Promise<DefaultResponseDto>} Token JWT
   */
  async create(usuarioData) {
    // Validação completa com Joi
    usuarioData.funcao = "usuario";
    const { error, value } = createUsuarioSchema.validate(usuarioData);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { email, senha, confirmedPassword, endereco_id, ...restData } = value;

    // Verifica se o email já existe
    const existingUsuario = await this.usuariosModel.selectByEmail(email);
    if (existingUsuario) {
      throw new AppError("Já existe um usuário com este email", 409);
    }

    // VALIDAÇÃO CRÍTICA: Se endereco_id foi fornecido, verifica se existe
    if (endereco_id) {
      const enderecoExists = await this.enderecosService.exists(endereco_id);
      if (!enderecoExists) {
        throw new AppError("Endereço não encontrado. Crie o endereço primeiro antes de criar o usuário.", 404);
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    // Prepara dados do novo usuário
    const newUsuario = {
      id: uuidv4(),
      ...restData,
      email,
      senha: hashedPassword,
      endereco_id: endereco_id || null,
      email_verificado: false, // Por padrão, email não verificado
      criado_em: new Date(),
      atualizado_em: new Date(),
    };

    const createdUsuario = await this.usuariosModel.create(newUsuario);

    // Gera token JWT
    const jwtPayload = this.createJwtPayload(createdUsuario);
    const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "24h" });

    return new DefaultResponseDto(true, "Usuário criado com sucesso", { token });
  }

  /**
   * Atualiza dados do usuário
   * @param {string} id - ID do usuário a ser atualizado
   * @param {Object} updateData - Dados para atualização
   * @param {string} requestUserId - ID do usuário que está fazendo a requisição
   * @returns {Promise<DefaultResponseDto>} Dados do usuário atualizado
   */
  async update(id, updateData, requestUserId) {
    // Validação do ID
    const { error: idError } = uuidSchema.validate(id);
    if (idError) {
      throw new AppError("ID inválido", 400);
    }

    // SEGURANÇA: Verifica se o usuário está atualizando a si mesmo
    // Posteriormente, você adicionará um middleware que passará requestUserId
    // Por hora, assumimos que requestUserId virá da requisição
    if (!requestUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    // Verifica se o usuário existe
    const originalUsuario = await this.usuariosModel.selectById(id);
    if (!originalUsuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    // SEGURANÇA CRÍTICA: Usuário só pode atualizar a si mesmo
    // (Exceção: admins poderão atualizar outros - implementar middleware de autorização)
    if (id !== requestUserId) {
      throw new AppError("Você não tem permissão para atualizar este usuário", 403);
    }

    // Validação dos dados de atualização
    const { error, value } = updateUsuarioSchema.validate(updateData);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Se está alterando email, verifica se já existe
    if (value.email && value.email !== originalUsuario.email) {
      const emailExists = await this.usuariosModel.selectByEmail(value.email);
      if (emailExists) {
        throw new AppError("Este email já está em uso", 409);
      }
      // Se alterar email, marca como não verificado novamente
      value.email_verificado = false;
    }

    // VALIDAÇÃO: Se está alterando endereco_id, verifica se existe
    if (value.endereco_id) {
      const enderecoExists = await this.enderecosService.exists(value.endereco_id);
      if (!enderecoExists) {
        throw new AppError("Endereço não encontrado. Crie ou use um endereço válido.", 404);
      }
    }

    // Adiciona timestamp de atualização
    value.atualizado_em = new Date();

    // Atualiza o usuário
    const updatedUsuario = await this.usuariosModel.update(id, value);
    if (!updatedUsuario) {
      throw new AppError("Erro ao atualizar usuário", 500);
    }

    const { senha, ...usuarioWithoutPassword } = updatedUsuario;
    return new DefaultResponseDto(true, "Usuário atualizado com sucesso", usuarioWithoutPassword);
  }

  /**
   * Atualiza a senha do usuário
   * @param {string} id - ID do usuário
   * @param {Object} passwordData - Objeto contendo senhaAtual, novaSenha e confirmedPassword
   * @param {string} requestUserId - ID do usuário que está fazendo a requisição
   * @returns {Promise<DefaultResponseDto>} Confirmação da atualização
   */
  async updatePassword(id, passwordData, requestUserId) {
    // Validação do ID
    const { error: idError } = uuidSchema.validate(id);
    if (idError) {
      throw new AppError("ID inválido", 400);
    }

    // SEGURANÇA: Verifica autenticação
    if (!requestUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    // SEGURANÇA: Usuário só pode alterar sua própria senha
    if (id !== requestUserId) {
      throw new AppError("Você não tem permissão para alterar a senha deste usuário", 403);
    }

    // Validação dos dados
    const { error, value } = updatePasswordSchema.validate(passwordData);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Busca usuário
    const usuario = await this.usuariosModel.selectById(id);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    // Verifica se a senha atual está correta
    const passwordMatch = await bcrypt.compare(value.senhaAtual, usuario.senha);
    if (!passwordMatch) {
      throw new AppError("Senha atual incorreta", 401);
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(value.novaSenha, SALT_ROUNDS);

    // Atualiza apenas a senha
    await this.usuariosModel.update(id, {
      senha: hashedPassword,
      atualizado_em: new Date(),
    });

    return new DefaultResponseDto(true, "Senha atualizada com sucesso", null);
  }

  /**
   * Deleta (soft delete) um usuário
   * @param {string} id - ID do usuário a ser deletado
   * @param {string} requestUserId - ID do usuário que está fazendo a requisição
   * @returns {Promise<DefaultResponseDto>} Confirmação da deleção
   */
  async delete(id, requestUserId) {
    // Validação do ID
    const { error: idError } = uuidSchema.validate(id);
    if (idError) {
      throw new AppError("ID inválido", 400);
    }

    // SEGURANÇA: Verifica autenticação
    if (!requestUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    // Verifica se o usuário existe
    const usuario = await this.usuariosModel.selectById(id);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    // SEGURANÇA: Usuário só pode deletar a si mesmo
    // (Exceção: admins poderão deletar outros - implementar middleware de autorização)
    if (id !== requestUserId) {
      throw new AppError("Você não tem permissão para deletar este usuário", 403);
    }

    const usuarioIsDeleted = await this.usuariosModel.delete(id);
    if (!usuarioIsDeleted) {
      throw new AppError("Erro ao deletar usuário", 500);
    }

    return new DefaultResponseDto(true, "Usuário deletado com sucesso", null);
  }

  /**
   * Cria o payload JWT com informações do usuário
   * @param {Object} usuario - Dados do usuário
   * @returns {Object} Payload JWT
   */
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
