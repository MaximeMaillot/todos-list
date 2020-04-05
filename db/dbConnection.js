/* eslint-disable no-undef */
import pgp from "pg-promise";

const dbConnectionData = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};
const db = pgp()(dbConnectionData);

export { db };
