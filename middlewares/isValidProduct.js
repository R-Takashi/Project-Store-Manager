const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(5).required().messages({
    'any.required': '"name" is required',
    'string.min': '"name" length must be at least 5 characters long',
  }),
});

const validName = (req, res, next) => {
  const { name } = req.body;
  const isValid = productSchema.validate({ name });

  if (isValid.error.details[0].type === 'any.required') {
    return res.status(400).json({ message: isValid.error.message });
  }

  if (isValid.error.details[0].type === 'string.min') {
    return res.status(422).json({ message: isValid.error.message });
  }

  next();
};

module.exports = { validName };