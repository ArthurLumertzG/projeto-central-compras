const Joi = require("joi");

const objectIdValidation = (value, helpers) => {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    return helpers.error("string.objectId");
  }
  return value;
};

const objectId = () =>
  Joi.string().custom(objectIdValidation, "ObjectId validation").messages({
    "string.objectId": "ID inválido",
  });

module.exports = { objectId, objectIdValidation };
