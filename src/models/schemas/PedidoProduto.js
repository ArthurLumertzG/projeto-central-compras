const mongoose = require("mongoose");

const pedidoProdutoSchema = new mongoose.Schema(
  {
    pedido_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pedido",
      required: true,
    },
    produto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produto",
      required: true,
    },
    quantidade: {
      type: Number,
      required: true,
    },
    valor_unitario: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : 0),
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

// Índices
pedidoProdutoSchema.index({ pedido_id: 1 });
pedidoProdutoSchema.index({ produto_id: 1 });
pedidoProdutoSchema.index({ deletado_em: 1 });

const PedidoProduto = mongoose.model("PedidoProduto", pedidoProdutoSchema);

module.exports = PedidoProduto;
