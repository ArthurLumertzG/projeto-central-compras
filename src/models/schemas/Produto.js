const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      maxlength: 255,
    },
    descricao: {
      type: String,
    },
    valor_unitario: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : 0),
    },
    quantidade_estoque: {
      type: Number,
      required: true,
      default: 0,
    },
    categoria: {
      type: String,
      required: true,
      maxlength: 50,
    },
    imagem_url: {
      type: String,
    },
    fornecedor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fornecedor",
    },
    deletado_em: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "criado_em",
      updatedAt: "atualizado_em",
    },
    toJSON: {
      getters: true,
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      getters: true,
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

produtoSchema.index({ nome: 1 });
produtoSchema.index({ categoria: 1 });
produtoSchema.index({ fornecedor_id: 1 });
produtoSchema.index({ deletado_em: 1 });

const Produto = mongoose.model("Produto", produtoSchema);

module.exports = Produto;
