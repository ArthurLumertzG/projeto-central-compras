const mongoose = require("mongoose");

const lojaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      maxlength: 255,
    },
    cnpj: {
      type: String,
      required: true,
      unique: true,
      maxlength: 18,
      index: true,
    },
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      index: true,
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

const Loja = mongoose.model("Loja", lojaSchema);

module.exports = Loja;
