import { Joi, validate } from "express-validation";
import { SignUpBody } from "../interfaces/auth.types";


export const signUp = validate({
    body: Joi.object<SignUpBody>({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      code: Joi.string().required()
    })
  })