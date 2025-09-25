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

const validateProduto = (produto) => {};

module.exports = { validateFornecedor, validateProduto };
