const Joi = require("joi");

const createProdutoSchema = Joi.object({
  nome: Joi.string().min(2).max(200).required().messages({
    "string.empty": "Nome é obrigatório",
    "string.min": "Nome deve ter no mínimo 2 caracteres",
    "string.max": "Nome deve ter no máximo 200 caracteres",
    "any.required": "Nome é obrigatório",
  }),

  descricao: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "Descrição é obrigatória",
    "string.min": "Descrição deve ter no mínimo 10 caracteres",
    "string.max": "Descrição deve ter no máximo 1000 caracteres",
    "any.required": "Descrição é obrigatória",
  }),

  valor_unitario: Joi.number().positive().precision(2).required().messages({
    "number.base": "Valor unitário deve ser um número",
    "number.positive": "Valor unitário deve ser positivo",
    "any.required": "Valor unitário é obrigatório",
  }),

  quantidade_estoque: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantidade em estoque deve ser um número",
    "number.integer": "Quantidade em estoque deve ser um número inteiro",
    "number.min": "Quantidade em estoque não pode ser negativa",
    "any.required": "Quantidade em estoque é obrigatória",
  }),

  fornecedor_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.empty": "ID do fornecedor é obrigatório",
    "string.pattern.base": "ID do fornecedor deve ser um ObjectId válido",
    "any.required": "ID do fornecedor é obrigatório",
  }),

  categoria: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Categoria é obrigatória",
    "string.min": "Categoria deve ter no mínimo 2 caracteres",
    "string.max": "Categoria deve ter no máximo 100 caracteres",
    "any.required": "Categoria é obrigatória",
  }),

  imagem_url: Joi.string().uri().allow(null, "").optional().messages({
    "string.uri": "URL da imagem deve ser uma URL válida",
  }),
});

const updateProdutoSchema = Joi.object({
  nome: Joi.string().min(2).max(200).messages({
    "string.min": "Nome deve ter no mínimo 2 caracteres",
    "string.max": "Nome deve ter no máximo 200 caracteres",
  }),

  descricao: Joi.string().min(10).max(1000).messages({
    "string.min": "Descrição deve ter no mínimo 10 caracteres",
    "string.max": "Descrição deve ter no máximo 1000 caracteres",
  }),

  valor_unitario: Joi.number().positive().precision(2).messages({
    "number.base": "Valor unitário deve ser um número",
    "number.positive": "Valor unitário deve ser positivo",
  }),

  quantidade_estoque: Joi.number().integer().min(0).messages({
    "number.base": "Quantidade em estoque deve ser um número",
    "number.integer": "Quantidade em estoque deve ser um número inteiro",
    "number.min": "Quantidade em estoque não pode ser negativa",
  }),

  fornecedor_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "ID do fornecedor deve ser um ObjectId válido",
  }),

  categoria: Joi.string().min(2).max(100).messages({
    "string.min": "Categoria deve ter no mínimo 2 caracteres",
    "string.max": "Categoria deve ter no máximo 100 caracteres",
  }),

  imagem_url: Joi.string().uri().allow(null, "").optional().messages({
    "string.uri": "URL da imagem deve ser uma URL válida",
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
  "string.empty": "ID é obrigatório",
  "string.pattern.base": "ID deve ser um ObjectId válido",
  "any.required": "ID é obrigatório",
});

const nomeSchema = Joi.string().min(1).max(200).required().messages({
  "string.empty": "Nome é obrigatório",
  "string.min": "Nome deve ter no mínimo 1 caractere",
  "string.max": "Nome deve ter no máximo 200 caracteres",
  "any.required": "Nome é obrigatório",
});

module.exports = {
  createProdutoSchema,
  updateProdutoSchema,
  uuidSchema,
  nomeSchema,
};
