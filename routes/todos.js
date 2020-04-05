import express from 'express';
const router = express.Router();
import { db } from '../db/dbConnection.js';

/**
 * get a list of all the todos
 */
router.get('/', (req, res) => {
  db.any('SELECT * FROM todo ORDER BY id')
    .then(function (data) {
      if (data.length === 0) {
        res.status(404).json({error: "No todo were found in the database"});
      } else {
        res.status(200).send(data);
      }
    })
    .catch(function (error) {
      res.status(500).send(error);
    })
});

/**
 * get one todo by id
 */
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.any('SELECT * FROM todo WHERE id = $1', id)
    .then(function (data) {
      if (data.length === 0) {
        res.status(404).json({error: "the todo with the id: " + id + " doesn't exist in the database"});
      } else {
        res.status(200).send(data[0]);
      }
    })
    .catch(function (error) {
      res.status(500).send(error);
    })
});

/**
 * create a new todo
 */
router.post('/', (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.status(400).json({error: "Name can't be null"});
  } else {
    db.any('INSERT INTO todo(name) VALUES($1) RETURNING *', name)
    .then(function (data) {
      res.status(200).send(data[0]);
    })
    .catch(function (error) {
      res.status(500).send(error);
    })
  }
});

/**
 * modify the name of a todo by id
 */
router.put('/:id', (req, res) => {
  const name = req.body.name;
  const id = req.params.id;

  if (!name) {
    res.status(400).json({error: "Name can't be null"});
  } else {
    db.any('UPDATE todo SET name = $1 WHERE id = $2 RETURNING *', [name, id])
    .then(function (data) {
      if (data.length === 0) {
        res.status(404).json({error: "the todo with the id: " + id + " doesn't exist in the database"});
      } else {
        res.status(200).send(data[0]);
      }
    })
    .catch(function (error) {
      res.status(500).send(error);
    })
  }
})

/**
 * delete a todo by id
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.any('DELETE FROM todo WHERE id = $1 RETURNING *', id)
    .then(function (data) {
      if (data.length === 0) {
        res.status(404).json({error: "the todo with the id: " + id + " doesn't exist in the database"});
      } else {
        res.status(204).send();
      }
    })
    .catch(function (error) {
      res.status(500).send(error);
    })
});

export { router };
