import vine from "@vinejs/vine";

async function validateEnv() {
  const schema = vine.object({
    PORT: vine
      .number()
      .withoutDecimals()
      .positive()
      .transform((value) => Number(value)),
  });

  return await vine.compile(schema).validate(process.env);
}

/**
 * @typedef {Awaited<ReturnType<typeof validateEnv>>} Env
 */

/** @type {Env} */
const env = await validateEnv();

export default env;
