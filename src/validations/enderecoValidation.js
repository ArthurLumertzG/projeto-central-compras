const Joi = require("joi");

const createEnderecoSchema = Joi.object({
  estado: Joi.string()
    .trim()
    .length(2)
    .uppercase()
    .pattern(/^[A-Z]{2}$/)
    .required()
    .messages({
      "string.empty": "Estado é obrigatório",
      "string.length": "Estado deve ter exatamente 2 caracteres (sigla)",
      "string.pattern.base": "Estado deve ser uma sigla válida (ex: SP, RJ, MG)",
      "any.required": "Estado é obrigatório",
    }),

  cidade: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Cidade é obrigatória",
    "string.min": "Cidade deve ter no mínimo 2 caracteres",
    "string.max": "Cidade deve ter no máximo 100 caracteres",
    "any.required": "Cidade é obrigatória",
  }),

  bairro: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Bairro é obrigatório",
    "string.min": "Bairro deve ter no mínimo 2 caracteres",
    "string.max": "Bairro deve ter no máximo 100 caracteres",
    "any.required": "Bairro é obrigatório",
  }),

  rua: Joi.string().trim().min(3).max(200).required().messages({
    "string.empty": "Rua é obrigatória",
    "string.min": "Rua deve ter no mínimo 3 caracteres",
    "string.max": "Rua deve ter no máximo 200 caracteres",
    "any.required": "Rua é obrigatória",
  }),

  numero: Joi.string().trim().max(10).required().messages({
    "string.empty": "Número é obrigatório",
    "string.max": "Número deve ter no máximo 10 caracteres",
    "any.required": "Número é obrigatório",
  }),

  complemento: Joi.string().trim().max(100).allow(null, "").messages({
    "string.max": "Complemento deve ter no máximo 100 caracteres",
  }),

  cep: Joi.string()
    .trim()
    .pattern(/^\d{5}-?\d{3}$/)
    .required()
    .messages({
      "string.empty": "CEP é obrigatório",
      "string.pattern.base": "CEP inválido. Use o formato 12345-678 ou 12345678",
      "any.required": "CEP é obrigatório",
    }),
});

const updateEnderecoSchema = Joi.object({
  estado: Joi.string()
    .trim()
    .length(2)
    .uppercase()
    .pattern(/^[A-Z]{2}$/)
    .messages({
      "string.length": "Estado deve ter exatamente 2 caracteres (sigla)",
      "string.pattern.base": "Estado deve ser uma sigla válida (ex: SP, RJ, MG)",
    }),

  cidade: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Cidade deve ter no mínimo 2 caracteres",
    "string.max": "Cidade deve ter no máximo 100 caracteres",
  }),

  bairro: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Bairro deve ter no mínimo 2 caracteres",
    "string.max": "Bairro deve ter no máximo 100 caracteres",
  }),

  rua: Joi.string().trim().min(3).max(200).messages({
    "string.min": "Rua deve ter no mínimo 3 caracteres",
    "string.max": "Rua deve ter no máximo 200 caracteres",
  }),

  numero: Joi.string().trim().max(10).messages({
    "string.max": "Número deve ter no máximo 10 caracteres",
  }),

  complemento: Joi.string().trim().max(100).allow(null, "").messages({
    "string.max": "Complemento deve ter no máximo 100 caracteres",
  }),

  cep: Joi.string()
    .trim()
    .pattern(/^\d{5}-?\d{3}$/)
    .messages({
      "string.pattern.base": "CEP inválido. Use o formato 12345-678 ou 12345678",
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

const cepSchema = Joi.string()
  .trim()
  .pattern(/^\d{5}-?\d{3}$/)
  .required()
  .messages({
    "string.empty": "CEP é obrigatório",
    "string.pattern.base": "CEP inválido. Use o formato 12345-678 ou 12345678",
    "any.required": "CEP é obrigatório",
  });

module.exports = {
  createEnderecoSchema,
  updateEnderecoSchema,
  uuidSchema,
  cepSchema,
};
