import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3001),

  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().min(16).required(),

  JWT_REFRESH_SECRET: Joi.string().min(16).required(),

  REDIS_URL: Joi.string().allow('').optional(),

  APP_NAME: Joi.string().default('WebOps Platform'),

  APP_URL: Joi.string().default('http://localhost:3001'),

  API_PREFIX: Joi.string().default('api'),

  API_VERSION: Joi.string().default('v1'),

  JWT_EXPIRES_IN: Joi.string().default('15m'),

  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
});
