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

module.exports = { validateFornecedor, validateUsuario };
