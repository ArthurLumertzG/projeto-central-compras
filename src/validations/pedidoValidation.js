const Joi = require("joi");

/**
 * Schema para validação de item do pedido
 */
const itemPedidoSchema = Joi.object({
  produto_id: Joi.string().uuid().required().messages({
    "string.guid": "ID do produto inválido",
    "any.required": "ID do produto é obrigatório",
  }),

  quantidade: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantidade deve ser um número",
    "number.integer": "Quantidade deve ser um número inteiro",
    "number.min": "Quantidade deve ser no mínimo 1",
    "any.required": "Quantidade é obrigatória",
  }),

  valor_unitario: Joi.number().min(0).precision(2).required().messages({
    "number.base": "Valor unitário deve ser um número",
    "number.min": "Valor unitário não pode ser negativo",
    "any.required": "Valor unitário é obrigatório",
  }),
});

/**
 * Schema de validação para criação de pedido
 */
const createPedidoSchema = Joi.object({
  descricao: Joi.string().trim().min(5).max(500).allow(null, "").messages({
    "string.min": "Descrição deve ter no mínimo 5 caracteres",
    "string.max": "Descrição deve ter no máximo 500 caracteres",
  }),

  loja_id: Joi.string().uuid().required().messages({
    "string.guid": "ID da loja inválido",
    "any.required": "ID da loja é obrigatório",
  }),

  status: Joi.string().valid("pendente", "enviado", "entregue", "cancelado").default("pendente").messages({
    "any.only": "Status deve ser: pendente, enviado, entregue ou cancelado",
  }),

  forma_pagamento: Joi.string().valid("dinheiro", "cartao_credito", "cartao_debito", "pix", "boleto").required().messages({
    "any.only": "Forma de pagamento deve ser: dinheiro, cartao_credito, cartao_debito, pix ou boleto",
    "any.required": "Forma de pagamento é obrigatória",
  }),

  prazo_dias: Joi.number().integer().min(1).max(365).required().messages({
    "number.base": "Prazo deve ser um número",
    "number.integer": "Prazo deve ser um número inteiro",
    "number.min": "Prazo deve ser no mínimo 1 dia",
    "number.max": "Prazo deve ser no máximo 365 dias",
    "any.required": "Prazo em dias é obrigatório",
  }),

  // Array de produtos do pedido
  produtos: Joi.array().items(itemPedidoSchema).min(1).required().messages({
    "array.base": "Produtos deve ser um array",
    "array.min": "Pedido deve conter pelo menos 1 produto",
    "any.required": "Lista de produtos é obrigatória",
  }),
});

/**
 * Schema de validação para atualização de pedido
 */
const updatePedidoSchema = Joi.object({
  descricao: Joi.string().trim().min(5).max(500).allow(null, "").messages({
    "string.min": "Descrição deve ter no mínimo 5 caracteres",
    "string.max": "Descrição deve ter no máximo 500 caracteres",
  }),

  status: Joi.string().valid("pendente", "enviado", "entregue", "cancelado").messages({
    "any.only": "Status deve ser: pendente, enviado, entregue ou cancelado",
  }),

  forma_pagamento: Joi.string().valid("dinheiro", "cartao_credito", "cartao_debito", "pix", "boleto").messages({
    "any.only": "Forma de pagamento deve ser: dinheiro, cartao_credito, cartao_debito, pix ou boleto",
  }),

  prazo_dias: Joi.number().integer().min(1).max(365).messages({
    "number.integer": "Prazo deve ser um número inteiro",
    "number.min": "Prazo deve ser no mínimo 1 dia",
    "number.max": "Prazo deve ser no máximo 365 dias",
  }),

  // Bloqueia campos que não devem ser atualizados
  id: Joi.forbidden(),
  usuario_id: Joi.forbidden(),
  loja_id: Joi.forbidden(),
  valor_total: Joi.forbidden(),
  criado_em: Joi.forbidden(),
  enviado_em: Joi.forbidden(),
  entregue_em: Joi.forbidden(),
  deletado_em: Joi.forbidden(),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser informado para atualização",
  });

/**
 * Schema de validação para UUID
 */
const uuidSchema = Joi.string().uuid().required().messages({
  "string.guid": "ID inválido",
  "any.required": "ID é obrigatório",
});

/**
 * Schema de validação para status
 */
const statusSchema = Joi.string().valid("pendente", "enviado", "entregue", "cancelado").required().messages({
  "any.only": "Status deve ser: pendente, enviado, entregue ou cancelado",
  "any.required": "Status é obrigatório",
});

/**
 * Schema de validação para data (formato YYYY-MM-DD)
 */
const dateSchema = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .required()
  .messages({
    "string.pattern.base": "Data deve estar no formato YYYY-MM-DD",
    "any.required": "Data é obrigatória",
  });

module.exports = {
  createPedidoSchema,
  updatePedidoSchema,
  itemPedidoSchema,
  uuidSchema,
  statusSchema,
  dateSchema,
};
