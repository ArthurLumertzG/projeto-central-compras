const Joi = require("joi");

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

  usuario_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({
    "string.pattern.base": "ID do usuário deve ser um ObjectId válido",
  }),
});

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

  usuario_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({
    "string.pattern.base": "ID do usuário deve ser um ObjectId válido",
  }),

  id: Joi.forbidden(),
  criado_em: Joi.forbidden(),
  atualizado_em: Joi.forbidden(),
  deletado_em: Joi.forbidden(),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser fornecido para atualização",
  });

const uuidSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
  "string.pattern.base": "ID inválido. Deve ser um ObjectId válido",
  "any.required": "ID é obrigatório",
});

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
