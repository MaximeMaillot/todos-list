import dotenv from "dotenv";

if (process.env.ENV !== "heroku") {
  const envPath = process.env.ENV ? `./.env.${process.env.ENV}` : "./.env";

  dotenv.config({
    path: envPath,
  });
}
