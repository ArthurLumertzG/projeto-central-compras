const Joi = require("joi");

const createCampanhaSchema = Joi.object({
  nome: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Nome é obrigatório",
    "string.min": "Nome deve ter no mínimo 3 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
    "any.required": "Nome é obrigatório",
  }),

  descricao: Joi.string().trim().min(10).max(500).allow(null, "").messages({
    "string.min": "Descrição deve ter no mínimo 10 caracteres",
    "string.max": "Descrição deve ter no máximo 500 caracteres",
  }),

  valor_min: Joi.number().min(0).precision(2).allow(null).messages({
    "number.min": "Valor mínimo não pode ser negativo",
    "number.base": "Valor mínimo deve ser um número",
  }),

  quantidade_min: Joi.number().integer().min(1).allow(null).messages({
    "number.integer": "Quantidade mínima deve ser um número inteiro",
    "number.min": "Quantidade mínima deve ser no mínimo 1",
    "number.base": "Quantidade mínima deve ser um número",
  }),

  desconto_porcentagem: Joi.number().min(0).max(100).precision(2).required().messages({
    "number.min": "Desconto deve ser no mínimo 0%",
    "number.max": "Desconto deve ser no máximo 100%",
    "number.base": "Desconto deve ser um número",
    "any.required": "Desconto é obrigatório",
  }),

  status: Joi.string().valid("ativo", "inativo").default("ativo").messages({
    "any.only": "Status deve ser: ativo ou inativo",
  }),
});

const updateCampanhaSchema = Joi.object({
  nome: Joi.string().trim().min(3).max(100).messages({
    "string.min": "Nome deve ter no mínimo 3 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
  }),

  descricao: Joi.string().trim().min(10).max(500).allow(null, "").messages({
    "string.min": "Descrição deve ter no mínimo 10 caracteres",
    "string.max": "Descrição deve ter no máximo 500 caracteres",
  }),

  valor_min: Joi.number().min(0).precision(2).allow(null).messages({
    "number.min": "Valor mínimo não pode ser negativo",
    "number.base": "Valor mínimo deve ser um número",
  }),

  quantidade_min: Joi.number().integer().min(1).allow(null).messages({
    "number.integer": "Quantidade mínima deve ser um número inteiro",
    "number.min": "Quantidade mínima deve ser no mínimo 1",
    "number.base": "Quantidade mínima deve ser um número",
  }),

  desconto_porcentagem: Joi.number().min(0).max(100).precision(2).messages({
    "number.min": "Desconto deve ser no mínimo 0%",
    "number.max": "Desconto deve ser no máximo 100%",
    "number.base": "Desconto deve ser um número",
  }),

  status: Joi.string().valid("ativo", "inativo").messages({
    "any.only": "Status deve ser: ativo ou inativo",
  }),

  id: Joi.forbidden(),
  criado_em: Joi.forbidden(),
  atualizado_em: Joi.forbidden(),
  deletado_em: Joi.forbidden(),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser informado para atualização",
  });

const uuidSchema = Joi.string().uuid().required().messages({
  "string.guid": "ID inválido",
  "any.required": "ID é obrigatório",
});

const statusSchema = Joi.string().valid("ativo", "inativo").required().messages({
  "any.only": "Status deve ser: ativo ou inativo",
  "any.required": "Status é obrigatório",
});

module.exports = {
  createCampanhaSchema,
  updateCampanhaSchema,
  uuidSchema,
  statusSchema,
};
