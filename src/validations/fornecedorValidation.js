const Joi = require("joi");

/**
 * Schema de validação para criação de fornecedor
 */
const createFornecedorSchema = Joi.object({
  cnpj: Joi.string()
    .trim()
    .pattern(/^\d{14}$/)
    .required()
    .messages({
      "string.empty": "CNPJ é obrigatório",
      "string.pattern.base": "CNPJ inválido. Deve conter exatamente 14 dígitos",
      "any.required": "CNPJ é obrigatório",
    }),

  razao_social: Joi.string().trim().min(2).max(255).optional().messages({
    "string.min": "Razão social deve ter no mínimo 2 caracteres",
    "string.max": "Razão social deve ter no máximo 255 caracteres",
  }),

  nome_fantasia: Joi.string().trim().min(2).max(255).optional().messages({
    "string.min": "Nome fantasia deve ter no mínimo 2 caracteres",
    "string.max": "Nome fantasia deve ter no máximo 255 caracteres",
  }),

  descricao: Joi.string().trim().min(2).max(500).optional().messages({
    "string.min": "Descrição deve ter no mínimo 2 caracteres",
    "string.max": "Descrição deve ter no máximo 500 caracteres",
  }),

  usuario_id: Joi.string().uuid().optional().messages({
    "string.guid": "ID do usuário deve ser um UUID válido",
  }),

  endereco_id: Joi.string().uuid().optional().allow(null).messages({
    "string.guid": "ID do endereço deve ser um UUID válido",
  }),
});

/**
 * Schema de validação para atualização de fornecedor
 */
const updateFornecedorSchema = Joi.object({
  cnpj: Joi.string()
    .trim()
    .pattern(/^\d{14}$/)
    .optional()
    .messages({
      "string.pattern.base": "CNPJ inválido. Deve conter exatamente 14 dígitos",
    }),

  razao_social: Joi.string().trim().min(2).max(255).optional().messages({
    "string.min": "Razão social deve ter no mínimo 2 caracteres",
    "string.max": "Razão social deve ter no máximo 255 caracteres",
  }),

  nome_fantasia: Joi.string().trim().min(2).max(255).optional().messages({
    "string.min": "Nome fantasia deve ter no mínimo 2 caracteres",
    "string.max": "Nome fantasia deve ter no máximo 255 caracteres",
  }),

  descricao: Joi.string().trim().min(2).max(500).optional().messages({
    "string.min": "Descrição deve ter no mínimo 2 caracteres",
    "string.max": "Descrição deve ter no máximo 500 caracteres",
  }),

  usuario_id: Joi.string().uuid().optional().messages({
    "string.guid": "ID do usuário deve ser um UUID válido",
  }),

  endereco_id: Joi.string().uuid().optional().allow(null).messages({
    "string.guid": "ID do endereço deve ser um UUID válido",
  }),

  // Bloqueia campos sensíveis
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
 */
const uuidSchema = Joi.string().uuid().required().messages({
  "string.guid": "ID inválido. Deve ser um UUID válido",
  "any.required": "ID é obrigatório",
});

/**
 * Schema de validação para CNPJ
 */
const cnpjSchema = Joi.string()
  .trim()
  .pattern(/^\d{14}$/)
  .required()
  .messages({
    "string.pattern.base": "CNPJ inválido. Deve conter exatamente 14 dígitos",
    "any.required": "CNPJ é obrigatório",
  });

module.exports = {
  createFornecedorSchema,
  updateFornecedorSchema,
  uuidSchema,
  cnpjSchema,
};
