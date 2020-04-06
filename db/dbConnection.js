/* eslint-disable no-undef */
import pgp from "pg-promise";

let db;
let environment = false;

process.argv.forEach((element) => {
  if (element.includes("mocha")) {
    environment = "test";
  }
});

if (environment === "test") {
  db = pgp()({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE_TEST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
} else {
  db = pgp()({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

export { db };
