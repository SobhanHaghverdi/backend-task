import vine from "@vinejs/vine";
import NodeEnv from "../common/constant/node-env-enum.js";

//* Convert empty strings to undefined to allow optional variables to be properly parsed
const cleanedEnv = Object.fromEntries(
  Object.entries(process.env).map(([k, v]) => [k, v === "" ? undefined : v])
);

async function validateEnv() {
  const schema = vine.object({
    CORS_ORIGIN: vine.string(),
    MONGODB_URI: vine.string(),
    NODE_ENV: vine.enum(Object.values(NodeEnv)),
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
