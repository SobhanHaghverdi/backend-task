import vine from "@vinejs/vine";

//* Convert empty strings to undefined to allow optional variables to be properly parsed
const cleanedEnv = Object.fromEntries(
  Object.entries(process.env).map(([k, v]) => [k, v === "" ? undefined : v])
);

async function validateEnv() {
  const schema = vine.object({
    CORS_ORIGIN: vine.string(),
    PORT: vine
      .number()
      .withoutDecimals()
      .positive()
      .transform((value) => Number(value)),
  });

  return await vine.compile(schema).validate(cleanedEnv);
}

/**
 * @typedef {Awaited<ReturnType<typeof validateEnv>>} Env
 */

/** @type {Env} */
const env = await validateEnv();

export default env;
