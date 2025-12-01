const FornecedoresService = require("../services/fornecedoresService");
const ProdutosService = require("../services/produtosService");
const PedidosService = require("../services/pedidosService");
const DefaultResponseDTO = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");

/**
 * @class FornecedoresController
 * @description Controller responsável por lidar com requisições HTTP de fornecedores
 */
class FornecedoresController {
  constructor() {
    this.fornecedoresService = new FornecedoresService();
    this.produtosService = new ProdutosService();
    this.pedidosService = new PedidosService();
  }

  /**
   * Retorna todos os fornecedores ativos
   * @route GET /fornecedores
   * @access Public
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Lista de fornecedores
   */
  async getAll(req, res) {
    const fornecedores = await this.fornecedoresService.getAll();
    res.status(200).json(new DefaultResponseDTO(true, "Fornecedores recuperados com sucesso", fornecedores));
  }

  /**
   * Busca um fornecedor por ID
   * @route GET /fornecedores/:id
   * @access Public
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - UUID do fornecedor
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Fornecedor encontrado
   * @throws {AppError} 400 se ID inválido, 404 se não encontrado
   */
  async getById(req, res) {
    const { id } = req.params;
    const fornecedor = await this.fornecedoresService.getById(id);
    res.status(200).json(new DefaultResponseDTO(true, "Fornecedor recuperado com sucesso", fornecedor));
  }

  /**
   * Busca um fornecedor por CNPJ
   * @route GET /fornecedores/cnpj/:cnpj
   * @access Public
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.cnpj - CNPJ do fornecedor (14 dígitos)
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Fornecedor encontrado
   * @throws {AppError} 400 se CNPJ inválido, 404 se não encontrado
   */
  async getByCnpj(req, res) {
    const { cnpj } = req.params;
    const fornecedor = await this.fornecedoresService.getByCnpj(cnpj);
    res.status(200).json(new DefaultResponseDTO(true, "Fornecedor recuperado com sucesso", fornecedor));
  }

  /**
   * Cria um novo fornecedor
   * @route POST /fornecedores
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do fornecedor
   * @param {string} req.body.cnpj - CNPJ do fornecedor (14 dígitos)
   * @param {string} [req.body.razao_social] - Razão social do fornecedor
   * @param {string} [req.body.nome_fantasia] - Nome fantasia do fornecedor
   * @param {string} [req.body.descricao] - Descrição do fornecedor (2-500 caracteres)
   * @param {string} [req.body.usuario_id] - UUID do usuário responsável
   * @param {string} [req.body.endereco_id] - UUID do endereço
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Fornecedor criado
   * @throws {AppError} 400 se dados inválidos, 404 se usuário/endereço não existe, 409 se CNPJ duplicado
   */
  async create(req, res) {
    const fornecedor = await this.fornecedoresService.create(req.body);
    res.status(201).json(new DefaultResponseDTO(true, "Fornecedor criado com sucesso", fornecedor));
  }

  /**
   * Atualiza um fornecedor existente
   * @route PATCH /fornecedores/:id
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - UUID do fornecedor
   * @param {string} req.userId - UUID do usuário autenticado (do middleware)
   * @param {Object} req.body - Dados para atualização (todos opcionais, mínimo 1 campo)
   * @param {string} [req.body.cnpj] - CNPJ do fornecedor (14 dígitos)
   * @param {string} [req.body.razao_social] - Razão social do fornecedor
   * @param {string} [req.body.nome_fantasia] - Nome fantasia do fornecedor
   * @param {string} [req.body.descricao] - Descrição do fornecedor (2-500 caracteres)
   * @param {string} [req.body.usuario_id] - UUID do usuário responsável
   * @param {string} [req.body.endereco_id] - UUID do endereço
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Fornecedor atualizado
   * @throws {AppError} 400 se dados inválidos, 403 se tentar atualizar fornecedor de outro usuário, 404 se fornecedor/usuário/endereço não existe, 409 se CNPJ duplicado
   */
  async update(req, res) {
    const { id } = req.params;
    const fornecedor = await this.fornecedoresService.update(id, req.body, req.userId);
    res.status(200).json(new DefaultResponseDTO(true, "Fornecedor atualizado com sucesso", fornecedor));
  }

  /**
   * Deleta um fornecedor (soft delete)
   * @route DELETE /fornecedores/:id
   * @access Private - Requer autenticação
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - UUID do fornecedor
   * @param {string} req.userId - UUID do usuário autenticado (do middleware)
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Confirmação de deleção
   * @throws {AppError} 400 se ID inválido, 403 se tentar deletar fornecedor de outro usuário, 404 se não encontrado
   */
  async delete(req, res) {
    const { id } = req.params;
    await this.fornecedoresService.delete(id, req.userId);
    res.status(200).json(new DefaultResponseDTO(true, null, "Fornecedor deletado com sucesso"));
  }

  /**
   * Retorna o perfil do fornecedor autenticado
   * @route GET /fornecedores/me
   * @access Private - Requer autenticação de fornecedor
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.userId - UUID do usuário autenticado
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Dados do fornecedor
   * @throws {AppError} 404 se fornecedor não encontrado
   */
  async getMyProfile(req, res) {
    const fornecedor = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedor || fornecedor.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    res.status(200).json(new DefaultResponseDTO(true, "Perfil recuperado com sucesso", fornecedor[0]));
  }

  /**
   * Atualiza o perfil do fornecedor autenticado
   * @route PATCH /fornecedores/me
   * @access Private - Requer autenticação de fornecedor
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.userId - UUID do usuário autenticado
   * @param {Object} req.body - Dados para atualização
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<void>} Fornecedor atualizado
   * @throws {AppError} 404 se fornecedor não encontrado
   */
  async updateMyProfile(req, res) {
    const fornecedores = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedores || fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    const fornecedorId = fornecedores[0].id;
    const fornecedor = await this.fornecedoresService.update(fornecedorId, req.body, req.userId);
    res.status(200).json(new DefaultResponseDTO(true, "Perfil atualizado com sucesso", fornecedor));
  }

  /**
   * Retorna todos os produtos do fornecedor autenticado
   * @route GET /fornecedores/me/produtos
   * @access Private - Requer autenticação de fornecedor
   */
  async getMyProducts(req, res) {
    const fornecedores = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedores || fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    const fornecedorId = fornecedores[0].id;
    const result = await this.produtosService.getByFornecedor(fornecedorId);
    res.status(200).json(result);
  }

  /**
   * Cria um novo produto para o fornecedor autenticado
   * @route POST /fornecedores/me/produtos
   * @access Private - Requer autenticação de fornecedor
   */
  async createMyProduct(req, res) {
    const fornecedores = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedores || fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    const fornecedorId = fornecedores[0].id;

    // Adiciona o fornecedor_id ao produto
    const produtoData = { ...req.body, fornecedor_id: fornecedorId };
    const result = await this.produtosService.create(produtoData);
    res.status(201).json(result);
  }

  /**
   * Atualiza um produto do fornecedor autenticado
   * @route PATCH /fornecedores/me/produtos/:id
   * @access Private - Requer autenticação de fornecedor
   */
  async updateMyProduct(req, res) {
    const { id } = req.params;
    const fornecedores = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedores || fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    const fornecedorId = fornecedores[0].id;

    // Verifica se o produto pertence ao fornecedor
    const produto = await this.produtosService.getById(id);
    if (produto.data.fornecedor_id !== fornecedorId) {
      throw new AppError("Você não tem permissão para editar este produto", 403);
    }

    const result = await this.produtosService.update(id, req.body);
    res.status(200).json(result);
  }

  /**
   * Deleta um produto do fornecedor autenticado
   * @route DELETE /fornecedores/me/produtos/:id
   * @access Private - Requer autenticação de fornecedor
   */
  async deleteMyProduct(req, res) {
    const { id } = req.params;
    const fornecedores = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedores || fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    const fornecedorId = fornecedores[0].id;

    // Verifica se o produto pertence ao fornecedor
    const produto = await this.produtosService.getById(id);
    if (produto.data.fornecedor_id !== fornecedorId) {
      throw new AppError("Você não tem permissão para deletar este produto", 403);
    }

    const result = await this.produtosService.delete(id);
    res.status(200).json(result);
  }

  /**
   * Retorna todos os pedidos do fornecedor autenticado
   * @route GET /fornecedores/me/pedidos
   * @access Private - Requer autenticação de fornecedor
   */
  async getMyOrders(req, res) {
    const fornecedores = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedores || fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    const fornecedorId = fornecedores[0].id;
    const result = await this.pedidosService.getByFornecedor(fornecedorId);
    res.status(200).json(result);
  }

  /**
   * Retorna um pedido específico do fornecedor autenticado
   * @route GET /fornecedores/me/pedidos/:id
   * @access Private - Requer autenticação de fornecedor
   */
  async getMyOrderById(req, res) {
    const { id } = req.params;
    const fornecedores = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedores || fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    const fornecedorId = fornecedores[0].id;

    // Busca o pedido e verifica se pertence ao fornecedor
    const pedido = await this.pedidosService.getById(id);
    if (pedido.data.fornecedor_id !== fornecedorId) {
      throw new AppError("Você não tem permissão para visualizar este pedido", 403);
    }

    res.status(200).json(pedido);
  }

  /**
   * Atualiza o status de um pedido do fornecedor autenticado
   * @route PATCH /fornecedores/me/pedidos/:id/status
   * @access Private - Requer autenticação de fornecedor
   */
  async updateMyOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const fornecedores = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedores || fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    const fornecedorId = fornecedores[0].id;

    // Busca o pedido e verifica se pertence ao fornecedor
    const pedido = await this.pedidosService.getById(id);
    if (pedido.data.fornecedor_id !== fornecedorId) {
      throw new AppError("Você não tem permissão para atualizar este pedido", 403);
    }

    const result = await this.pedidosService.update(id, { status }, req.userId);
    res.status(200).json(result);
  }

  /**
   * Retorna estatísticas do fornecedor autenticado
   * @route GET /fornecedores/me/statistics
   * @access Private - Requer autenticação de fornecedor
   */
  async getMyStatistics(req, res) {
    const fornecedores = await this.fornecedoresService.getByUsuarioId(req.userId);
    if (!fornecedores || fornecedores.length === 0) {
      throw new AppError("Fornecedor não encontrado para este usuário", 404);
    }
    const fornecedorId = fornecedores[0].id;

    // Busca produtos
    const produtosResult = await this.produtosService.getByFornecedor(fornecedorId);
    const totalProducts = produtosResult.data.length;

    // Busca pedidos
    const pedidosResult = await this.pedidosService.getByFornecedor(fornecedorId);
    const pedidos = pedidosResult.data;
    const totalOrders = pedidos.length;
    const pendingOrders = pedidos.filter((p) => p.status === "pendente").length;

    // Calcula receita mensal (pedidos do mês atual)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = pedidos
      .filter((p) => {
        const createdAt = new Date(p.criado_em);
        return createdAt >= firstDayOfMonth && ["entregue", "enviado"].includes(p.status);
      })
      .reduce((sum, p) => sum + parseFloat(p.valor_total), 0);

    const statistics = {
      totalProducts,
      totalOrders,
      pendingOrders,
      monthlyRevenue,
    };

    res.status(200).json(new DefaultResponseDTO(true, "Estatísticas recuperadas com sucesso", statistics));
  }
}

module.exports = FornecedoresController;
