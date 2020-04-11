import { db } from "./dbConnection.js";

/**
 * Select all todo from the database
 * @returns {Promise}
 */
export function getAll() {
  return db.any("SELECT * FROM todo ORDER BY id");
}

/**
 * Select a todo from the database
 * @param {Number} id
 * @returns {Promise}
 */
export function getById(id) {
  return db.any("SELECT * FROM todo WHERE id = $1", id);
}

/**
 * Insert a todo in the database
 * @param {String} name
 * @returns {Promise}
 */
export function insert(name) {
  return db.one("INSERT INTO todo(name) VALUES($1) RETURNING *", name);
}

/**
 * Update a todo in the database
 * @param {Number} id
 * @param {String} name
 * @returns {Promise}
 */
export function update(id, name) {
  return db.any("UPDATE todo SET name = $1 WHERE id = $2 RETURNING *", [
    name,
    id,
  ]);
}

/**
 * Delete a todo from the database
 * @param {Number} id
 * @returns {Promise}
 */
export function remove(id) {
  return db.any("DELETE FROM todo WHERE id = $1 RETURNING *", id);
}

/**
 * Delete all the todos from the database
 */
export function clear() {
  db.none("DELETE FROM todo");
}
