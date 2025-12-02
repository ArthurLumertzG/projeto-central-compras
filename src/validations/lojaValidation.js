const Joi = require("joi");

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

  id: Joi.forbidden(),
  criado_em: Joi.forbidden(),
  atualizado_em: Joi.forbidden(),
  deletado_em: Joi.forbidden(),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser fornecido para atualização",
  });

const uuidSchema = Joi.string().uuid().required().messages({
  "string.empty": "ID é obrigatório",
  "string.guid": "ID deve ser um UUID válido",
  "any.required": "ID é obrigatório",
});

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
