const validateFornecedor = (fornecedor) => {
  if (!fornecedor) {
    return "Fornecedor não informado";
  }

  const requiredFields = ["nome", "categoria", "email", "telefone", "status"];
  const fieldsMissing = requiredFields.filter((field) => !fornecedor[field]);

  if (fieldsMissing.length > 0) {
    return `Campos obrigatórios faltando: ${fieldsMissing.join(", ")}`;
  }

  if (
    fornecedor.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fornecedor.email)
  ) {
    return "Email inválido";
  }

  if (fornecedor.telefone && fornecedor.telefone.length < 8) {
    return "Telefone inválido";
  }

  return null;
};

const validateProduto = async (produto) => {
  if (!produto) {
    return "Produto não informado";
  }

  const requiredFields = [
    "nome",
    "descricao",
    "preco",
    "estoque",
    "fornecedor_id",
    "status",
  ];

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

  const fornecedorValido = fornecedores.some(
    (fornecedor) => fornecedor.id == produto.fornecedor_id
  );

  if (!fornecedorValido) {
    return "O id de fornecedor informado não existe!";
  }

  return null;
};

module.exports = { validateFornecedor, validateProduto };
