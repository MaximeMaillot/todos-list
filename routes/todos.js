const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const cn = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}
const db = pgp(cn);

/**
 * get a list of all the todos
 */
router.get('/', (req, res) => {
  db.many('SELECT * FROM todo ORDER BY id')
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      res.status(404).send();
    })
});

/**
 * get one todo by id
 */
router.get('/:id', (req, res) => {
  db.one('SELECT * FROM todo WHERE id = $1', req.params.id)
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      res.status(404).send();
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
    db.one('INSERT INTO todo(name) VALUES($1) RETURNING *', name) 
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (error) {
      res.status(404).send(error);
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
    db.one('UPDATE todo SET name = $1 WHERE id = $2 RETURNING *', [name, id]) 
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (error) {
      res.status(404).send(error);
    })
  }
})

/**
 * delete a todo by id
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.one('DELETE FROM todo WHERE id = $1 RETURNING *', id) 
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (error) {
      res.status(404).send(error);
    })
});

module.exports = router;
