import Joi from 'joi';

const schema = Joi.object({
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
}).unknown(true);

export function validate(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const result = schema.validate(config, { abortEarly: false });

  if (result.error) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }

  return result.value as Record<string, unknown>;
}
