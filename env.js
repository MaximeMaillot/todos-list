import dotenv from "dotenv";

let environment = "dev";

process.argv.forEach((element) => {
  if (element.includes("mocha")) {
    environment = "test";
  }
});
if (environment === "test") {
  dotenv.config({ path: "./.env.test" });
} else {
  dotenv.config();
}
