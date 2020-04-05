import { db } from "./dbConnection.js";

export function init(database) {
  if (database === "todolist") {
    db.none(
      "CREATE TABLE IF NOT EXISTS todo(" +
        "id serial NOT NULL PRIMARY KEY," +
        "name text NOT NULL," +
        "created_at date NOT NULL DEFAULT CURRENT_DATE)"
    )
      .then(function (data) {
        console.log("table was created if it did not exist");
      })
      .catch(function (error) {
        throw error;
      });
  }
}
