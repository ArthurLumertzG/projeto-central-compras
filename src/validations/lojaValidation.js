const Joi = require("joi");

/**
 * Schema de validação para criação de loja
 * Todos os campos obrigatórios
 */
const createLojaSchema = Joi.object({
  nome: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Nome é obrigatório",
    "string.min": "Nome deve ter no mínimo 2 caracteres",
    "string.max": "Nome deve ter no máximo 200 caracteres",
    "any.required": "Nome é obrigatório",
  }),

  cnpj: Joi.string()
    .trim()
    .pattern(/^\d{14}$/)
    .required()
    .messages({
      "string.empty": "CNPJ é obrigatório",
      "string.pattern.base": "CNPJ inválido. Deve conter exatamente 14 dígitos",
      "any.required": "CNPJ é obrigatório",
    }),

  usuario_id: Joi.string().uuid().required().messages({
    "string.empty": "ID do usuário é obrigatório",
    "string.guid": "ID do usuário deve ser um UUID válido",
    "any.required": "ID do usuário é obrigatório",
  }),

  endereco_id: Joi.string().uuid().allow(null).messages({
    "string.guid": "ID do endereço deve ser um UUID válido",
  }),
});

/**
 * Schema de validação para atualização de loja
 * Todos os campos opcionais, mas ao menos 1 obrigatório
 * Campos sensíveis são bloqueados
 */
const updateLojaSchema = Joi.object({
  nome: Joi.string().trim().min(2).max(200).messages({
    "string.min": "Nome deve ter no mínimo 2 caracteres",
    "string.max": "Nome deve ter no máximo 200 caracteres",
  }),

  cnpj: Joi.string()
    .trim()
    .pattern(/^\d{14}$/)
    .messages({
      "string.pattern.base": "CNPJ inválido. Deve conter exatamente 14 dígitos",
    }),

  usuario_id: Joi.string().uuid().messages({
    "string.guid": "ID do usuário deve ser um UUID válido",
  }),

  endereco_id: Joi.string().uuid().allow(null).messages({
    "string.guid": "ID do endereço deve ser um UUID válido",
  }),

  // Campos bloqueados - não podem ser atualizados diretamente
  id: Joi.forbidden(),
  criado_em: Joi.forbidden(),
  atualizado_em: Joi.forbidden(),
  deletado_em: Joi.forbidden(),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser fornecido para atualização",
  });

/**
 * Schema de validação para UUID
 * Usado para validar IDs em parâmetros de rota
 */
const uuidSchema = Joi.string().uuid().required().messages({
  "string.empty": "ID é obrigatório",
  "string.guid": "ID deve ser um UUID válido",
  "any.required": "ID é obrigatório",
});

/**
 * Schema de validação para CNPJ
 * Usado para busca por CNPJ
 */
const cnpjSchema = Joi.string()
  .trim()
  .pattern(/^\d{14}$/)
  .required()
  .messages({
    "string.empty": "CNPJ é obrigatório",
    "string.pattern.base": "CNPJ inválido. Deve conter exatamente 14 dígitos",
    "any.required": "CNPJ é obrigatório",
  });

module.exports = {
  createLojaSchema,
  updateLojaSchema,
  uuidSchema,
  cnpjSchema,
};
