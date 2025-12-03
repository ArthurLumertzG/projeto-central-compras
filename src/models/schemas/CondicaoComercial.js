const mongoose = require("mongoose");

const condicaoComercialSchema = new mongoose.Schema(
  {
    uf: {
      type: String,
      required: true,
      maxlength: 2,
    },
    cashback_porcentagem: {
      type: mongoose.Schema.Types.Decimal128,
      get: (v) => (v ? parseFloat(v.toString()) : 0),
    },
    prazo_extendido_dias: {
      type: Number,
    },
    variacao_unitario: {
      type: mongoose.Schema.Types.Decimal128,
      get: (v) => (v ? parseFloat(v.toString()) : 0),
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

condicaoComercialSchema.index({ fornecedor_id: 1 });
condicaoComercialSchema.index({ uf: 1 });
condicaoComercialSchema.index({ deletado_em: 1 });

const CondicaoComercial = mongoose.model("CondicaoComercial", condicaoComercialSchema);

module.exports = CondicaoComercial;
