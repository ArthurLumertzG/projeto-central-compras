const Joi = require("joi");

const createUsuarioSchema = Joi.object({
  nome: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Nome é obrigatório",
    "string.min": "Nome deve ter pelo menos 2 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
    "any.required": "Nome é obrigatório",
  }),

  sobrenome: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Sobrenome é obrigatório",
    "string.min": "Sobrenome deve ter pelo menos 2 caracteres",
    "string.max": "Sobrenome deve ter no máximo 100 caracteres",
    "any.required": "Sobrenome é obrigatório",
  }),

  email: Joi.string().trim().lowercase().email().max(255).required().messages({
    "string.empty": "Email é obrigatório",
    "string.email": "Email inválido",
    "string.max": "Email deve ter no máximo 255 caracteres",
    "any.required": "Email é obrigatório",
  }),

  senha: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.empty": "Senha é obrigatória",
      "string.min": "Senha deve ter pelo menos 8 caracteres",
      "string.max": "Senha deve ter no máximo 100 caracteres",
      "string.pattern.base": "Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&)",
      "any.required": "Senha é obrigatória",
    }),

  confirmedPassword: Joi.string().valid(Joi.ref("senha")).required().messages({
    "any.only": "As senhas não coincidem",
    "any.required": "Confirmação de senha é obrigatória",
  }),

  telefone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .min(10)
    .max(20)
    .allow(null, "")
    .messages({
      "string.pattern.base": "Telefone inválido. Use o formato internacional (ex: +5511999999999)",
      "string.min": "Telefone deve ter pelo menos 10 caracteres",
      "string.max": "Telefone deve ter no máximo 20 caracteres",
    }),

  funcao: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .messages({
      "string.max": "Função deve ter no máximo 100 caracteres",
    })
    .valid("admin", "usuario", "fornecedor", "loja")
    .messages({
      "any.only": "Função deve ser uma das seguintes: admin, usuario, fornecedor, loja",
    }),

  endereco_id: Joi.string().uuid().allow(null).messages({
    "string.guid": "ID do endereço deve ser um UUID válido",
  }),
}).options({ stripUnknown: true });

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email é obrigatório",
    "string.email": "Email inválido",
    "any.required": "Email é obrigatório",
  }),

  senha: Joi.string().required().messages({
    "string.empty": "Senha é obrigatória",
    "any.required": "Senha é obrigatória",
  }),
}).options({ stripUnknown: true });

const updateUsuarioSchema = Joi.object({
  nome: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Nome deve ter pelo menos 2 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
  }),

  sobrenome: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Sobrenome deve ter pelo menos 2 caracteres",
    "string.max": "Sobrenome deve ter no máximo 100 caracteres",
  }),

  email: Joi.string().trim().lowercase().email().max(255).messages({
    "string.email": "Email inválido",
    "string.max": "Email deve ter no máximo 255 caracteres",
  }),

  telefone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .min(10)
    .max(20)
    .allow(null, "")
    .messages({
      "string.pattern.base": "Telefone inválido. Use o formato internacional (ex: +5511999999999)",
      "string.min": "Telefone deve ter pelo menos 10 caracteres",
      "string.max": "Telefone deve ter no máximo 20 caracteres",
    }),

  funcao: Joi.string().trim().max(100).allow(null, "").messages({
    "string.max": "Função deve ter no máximo 100 caracteres",
  }),

  endereco_id: Joi.string().uuid().allow(null).messages({
    "string.guid": "ID do endereço deve ser um UUID válido",
  }),

  id: Joi.forbidden(),
  email_verificado: Joi.forbidden(),
  criado_em: Joi.forbidden(),
  atualizado_em: Joi.forbidden(),
  deletado_em: Joi.forbidden(),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser informado para atualização",
  })
  .options({ stripUnknown: true });

const updatePasswordSchema = Joi.object({
  senhaAtual: Joi.string().required().messages({
    "string.empty": "Senha atual é obrigatória",
    "any.required": "Senha atual é obrigatória",
  }),

  novaSenha: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .invalid(Joi.ref("senhaAtual"))
    .messages({
      "string.empty": "Nova senha é obrigatória",
      "string.min": "Nova senha deve ter pelo menos 8 caracteres",
      "string.max": "Nova senha deve ter no máximo 100 caracteres",
      "string.pattern.base": "Nova senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&)",
      "any.invalid": "Nova senha deve ser diferente da senha atual",
      "any.required": "Nova senha é obrigatória",
    }),

  confirmarNovaSenha: Joi.string().valid(Joi.ref("novaSenha")).required().messages({
    "any.only": "As senhas não coincidem",
    "any.required": "Confirmação de senha é obrigatória",
  }),
}).options({ stripUnknown: true });

const uuidSchema = Joi.string().uuid().required().messages({
  "string.guid": "ID inválido",
  "any.required": "ID é obrigatório",
});

module.exports = {
  createUsuarioSchema,
  loginSchema,
  updateUsuarioSchema,
  updatePasswordSchema,
  uuidSchema,
};
