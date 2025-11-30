const Joi = require("joi");

/**
 * Schema de validação para criação de vínculo loja-fornecedor
 */
const createLojaFornecedorSchema = Joi.object({
  loja_id: Joi.string().uuid().required().messages({
    "string.guid": "ID da loja inválido",
    "any.required": "ID da loja é obrigatório",
  }),

  fornecedor_id: Joi.string().uuid().required().messages({
    "string.guid": "ID do fornecedor inválido",
    "any.required": "ID do fornecedor é obrigatório",
  }),
});

/**
 * Schema de validação para UUID
 */
const uuidSchema = Joi.string().uuid().required().messages({
  "string.guid": "ID inválido",
  "any.required": "ID é obrigatório",
});

module.exports = {
  createLojaFornecedorSchema,
  uuidSchema,
};
