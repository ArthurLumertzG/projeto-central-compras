const mongoose = require("mongoose");

const enderecoSchema = new mongoose.Schema(
  {
    estado: {
      type: String,
      required: true,
      maxlength: 2,
    },
    cidade: {
      type: String,
      required: true,
      maxlength: 100,
    },
    bairro: {
      type: String,
      required: true,
      maxlength: 100,
    },
    rua: {
      type: String,
      required: true,
      maxlength: 255,
    },
    numero: {
      type: String,
      required: true,
      maxlength: 20,
    },
    complemento: {
      type: String,
      maxlength: 100,
    },
    cep: {
      type: String,
      required: true,
      maxlength: 8,
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

enderecoSchema.index({ cep: 1 });
enderecoSchema.index({ deletado_em: 1 });

const Endereco = mongoose.model("Endereco", enderecoSchema);

module.exports = Endereco;
