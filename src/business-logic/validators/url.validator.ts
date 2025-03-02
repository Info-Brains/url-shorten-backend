import Joi from "joi";

export const urlValidator = Joi.object({
  url: Joi.string().uri().required(),
});

export default {
    urlValidator
}
