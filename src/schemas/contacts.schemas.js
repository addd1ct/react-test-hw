import Joi from 'joi';

const base = {
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
};

export const createContactSchema = Joi.object({
  ...base,
  name: base.name.required(),
  phoneNumber: base.phoneNumber.required(),
  contactType: base.contactType.required(),
});

export const updateContactSchema = Joi.object(base).min(1);
