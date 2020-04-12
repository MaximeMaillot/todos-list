/* eslint-disable no-undef */
import dotenv from "dotenv";

const envPath = process.env.ENV ? `./.env.${process.env.ENV}` : "./.env";

dotenv.config({
  path: envPath,
});
