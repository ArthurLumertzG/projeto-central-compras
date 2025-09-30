const validateFornecedor = (fornecedor) => {
  if (!fornecedor) {
    return "Fornecedor não informado";
  }

  const requiredFields = ["nome", "categoria", "email", "telefone", "status"];
  const fieldsMissing = requiredFields.filter((field) => !fornecedor[field]);

  if (fieldsMissing.length > 0) {
    return `Campos obrigatórios faltando: ${fieldsMissing.join(", ")}`;
  }

  if (fornecedor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fornecedor.email)) {
    return "Email inválido";
  }

  if (fornecedor.telefone && fornecedor.telefone.length < 8) {
    return "Telefone inválido";
  }

  return null;
};

const validateUsuario = (usuario) => {
  if (!usuario) {
    return "Usuário não informado";
  }

  const requiredFields = ["nome", "email", "user", "password", "confirmedPassword", "level", "status"];
  const fieldsMissing = requiredFields.filter((field) => !usuario[field]);

  if (fieldsMissing.length > 0) {
    return `Campos obrigatórios faltando: ${fieldsMissing.join(", ")}`;
  }

  if (usuario.password < 6) {
    return "A senha deve ter pelo menos 6 caracteres";
  }

  if (usuario.status !== "on" && usuario.status !== "off") {
    return "Status inválido";
  }

  if (usuario.level !== "admin" && usuario.level !== "user") {
    return "Nível inválido";
  }

  if (usuario.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
    return "Email inválido";
  }

  if (usuario.password !== usuario.confirmedPassword) {
    return "As senhas não coincidem";
  }

  return null;
};

const validateProduto = async (produto) => {
  if (!produto) {
    return "Produto não informado";
  }

  const requiredFields = ["nome", "descricao", "preco", "estoque", "fornecedor_id", "status"];

  const fieldsMissing = requiredFields.filter((field) => !produto[field]);

  if (fieldsMissing.length > 0) {
    return `Campos obrigatórios faltando: ${fieldsMissing.join(", ")}`;
  }

  const FornecedoresService = require("../services/fornecedoresService");
  const fornecedoresService = new FornecedoresService();

  const response = await fornecedoresService.getAll();
  const fornecedores = response.data;

  if (!fornecedores || fornecedores.length === 0) {
    return "Não há fornecedores registrados.";
  }

  const fornecedorValido = fornecedores.some((fornecedor) => fornecedor.id == produto.fornecedor_id);

  if (!fornecedorValido) {
    return "O id de fornecedor informado não existe!";
  }

  return null;
};

const validateStore = (store) => {
  if (!store) {
    return "Loja não informada";
  }

  const requiredFields = ["nome", "endereco", "cnpj", "email", "telefone", "status"];
  const fieldsMissing = requiredFields.filter((field) => !store[field]);

  if (fieldsMissing.length > 0) {
    return `Campos obrigatórios faltando: ${fieldsMissing.join(", ")}`;
  }

  if (store.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.email)) {
    return "Email inválido";
  }

  if (store.cnpj && !/^\d{14}$/.test(store.cnpj)) {
    return "CNPJ inválido";
  }

  if (store.telefone && store.telefone.length < 8) {
    return "Telefone inválido";
  }

  return null;
};

module.exports = { validateFornecedor, validateUsuario, validateProduto, validateStore };
