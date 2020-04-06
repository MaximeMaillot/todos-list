import { db } from "./dbConnection.js";

export function getAll() {
  return db.any("SELECT * FROM todo ORDER BY id");
}

export function getById(id) {
  return db.any("SELECT * FROM todo WHERE id = $1", id);
}

export function insert(name) {
  return db.any("INSERT INTO todo(name) VALUES($1) RETURNING *", name);
}

export function update(id, name) {
  return db.any("UPDATE todo SET name = $1 WHERE id = $2 RETURNING *", [
    name,
    id,
  ]);
}

export function remove(id) {
  return db.any("DELETE FROM todo WHERE id = $1 RETURNING *", id);
}

export function clear() {
  db.none("DELETE FROM todo");
}
