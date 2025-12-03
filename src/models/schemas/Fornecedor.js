const mongoose = require("mongoose");

const fornecedorSchema = new mongoose.Schema(
  {
    cnpj: {
      type: String,
      required: true,
      unique: true,
      maxlength: 18,
      index: true,
    },
    descricao: {
      type: String,
    },
    nome_fantasia: {
      type: String,
      maxlength: 100,
    },
    razao_social: {
      type: String,
      maxlength: 150,
    },
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      index: true,
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

const Fornecedor = mongoose.model("Fornecedor", fornecedorSchema);

module.exports = Fornecedor;
