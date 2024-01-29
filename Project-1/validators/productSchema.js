import Joi from "joi";
const productSchema = Joi.object({
  productName: Joi.string().required(),
  price: Joi.number().required(),
  size: Joi.string().required(),
  image: Joi.string(),
});

export default productSchema;
