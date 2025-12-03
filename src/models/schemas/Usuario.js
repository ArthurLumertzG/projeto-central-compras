const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      maxlength: 100,
    },
    sobrenome: {
      type: String,
      required: true,
      maxlength: 100,
    },
    senha: {
      type: String,
      required: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      index: true,
    },
    email_verificado: {
      type: Boolean,
      default: false,
    },
    telefone: {
      type: String,
      maxlength: 20,
    },
    funcao: {
      type: String,
      required: true,
      enum: ["admin", "loja", "fornecedor", "usuario"],
    },
    endereco_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Endereco",
    },
    deletado_em: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: "criado_em",
      updatedAt: "atualizado_em",
    },
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
