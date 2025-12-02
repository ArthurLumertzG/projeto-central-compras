const Joi = require("joi");

const UFS_VALIDAS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const createCondicaoComercialSchema = Joi.object({
  uf: Joi.string()
    .uppercase()
    .valid(...UFS_VALIDAS)
    .required()
    .messages({
      "string.empty": "UF é obrigatório",
      "any.only": "UF deve ser uma sigla válida de estado brasileiro",
      "any.required": "UF é obrigatório",
    }),

  cashback_porcentagem: Joi.number().min(0).max(100).precision(2).required().messages({
    "number.min": "Cashback deve ser no mínimo 0%",
    "number.max": "Cashback deve ser no máximo 100%",
    "number.base": "Cashback deve ser um número",
    "any.required": "Cashback é obrigatório",
  }),

  prazo_extendido_dias: Joi.number().integer().min(0).required().messages({
    "number.integer": "Prazo extendido deve ser um número inteiro",
    "number.min": "Prazo extendido não pode ser negativo",
    "number.base": "Prazo extendido deve ser um número",
    "any.required": "Prazo extendido é obrigatório",
  }),

  variacao_unitario: Joi.number().precision(2).required().messages({
    "number.base": "Variação unitário deve ser um número",
    "any.required": "Variação unitário é obrigatório",
  }),
});

const updateCondicaoComercialSchema = Joi.object({
  cashback_porcentagem: Joi.number().min(0).max(100).precision(2).messages({
    "number.min": "Cashback deve ser no mínimo 0%",
    "number.max": "Cashback deve ser no máximo 100%",
    "number.base": "Cashback deve ser um número",
  }),

  prazo_extendido_dias: Joi.number().integer().min(0).messages({
    "number.integer": "Prazo extendido deve ser um número inteiro",
    "number.min": "Prazo extendido não pode ser negativo",
    "number.base": "Prazo extendido deve ser um número",
  }),

  variacao_unitario: Joi.number().precision(2).messages({
    "number.base": "Variação unitário deve ser um número",
  }),

  id: Joi.forbidden(),
  uf: Joi.forbidden(),
  fornecedor_id: Joi.forbidden(),
  criado_em: Joi.forbidden(),
  atualizado_em: Joi.forbidden(),
  deletado_em: Joi.forbidden(),
}).min(1);

module.exports = {
  createCondicaoComercialSchema,
  updateCondicaoComercialSchema,
};
