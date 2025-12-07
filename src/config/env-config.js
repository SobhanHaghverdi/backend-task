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
    MULTER_MAX_FILE_SIZE: vine.number().min(1),
    MONGODB_MIN_POOL_SIZE: vine.number().min(1),
    MONGODB_MAX_POOL_SIZE: vine.number().min(1),
    MONGODB_READ_PREFERENCE: vine.enum([
      "nearest",
      "primary",
      "primary",
      "secondary",
      "primaryPreferred",
      "secondaryPreferred",
    ]),
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
