export function init(db) {
  db.none(
    "CREATE TABLE IF NOT EXISTS todo(" +
      "id serial NOT NULL PRIMARY KEY," +
      "name text NOT NULL," +
      "created_at date NOT NULL DEFAULT CURRENT_DATE)"
  )
    .then(function () {})
    .catch(function (error) {
      throw error;
    });
}
