const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema(
  {
    valor_total: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : 0),
    },
    descricao: {
      type: String,
    },
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    loja_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
    },
    fornecedor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fornecedor",
    },
    status: {
      type: String,
      required: true,
      enum: ["pendente", "processando", "enviado", "entregue", "cancelado"],
      default: "pendente",
    },
    forma_pagamento: {
      type: String,
      required: true,
      enum: ["cartao", "pix"],
    },
    prazo_dias: {
      type: Number,
      required: true,
    },
    enviado_em: {
      type: Date,
      default: null,
    },
    entregue_em: {
      type: Date,
      default: null,
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
pedidoSchema.index({ usuario_id: 1 });
pedidoSchema.index({ loja_id: 1 });
pedidoSchema.index({ fornecedor_id: 1 });
pedidoSchema.index({ status: 1 });
pedidoSchema.index({ criado_em: -1 });
pedidoSchema.index({ deletado_em: 1 });

const Pedido = mongoose.model("Pedido", pedidoSchema);

module.exports = Pedido;
