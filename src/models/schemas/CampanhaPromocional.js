const mongoose = require("mongoose");

const campanhaPromocionalSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      maxlength: 255,
    },
    descricao: {
      type: String,
    },
    valor_min: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : 0),
    },
    quantidade_min: {
      type: Number,
      required: true,
    },
    desconto_porcentagem: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : 0),
    },
    status: {
      type: String,
      required: true,
      enum: ["ativo", "inativo", "expirado"],
      default: "ativo",
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

campanhaPromocionalSchema.index({ fornecedor_id: 1 });
campanhaPromocionalSchema.index({ status: 1 });
campanhaPromocionalSchema.index({ deletado_em: 1 });

const CampanhaPromocional = mongoose.model("CampanhaPromocional", campanhaPromocionalSchema);

module.exports = CampanhaPromocional;
