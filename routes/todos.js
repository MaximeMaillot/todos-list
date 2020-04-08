import express from "express";
const router = express.Router();
import * as dbQuery from "../db/dbQuery.js";

/**
 * get a list of all the todos
 */
router.get("/", (req, res) => {
  dbQuery
    .getAll()
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
});

/**
 * get one todo by id
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;
  dbQuery
    .getById(id)
    .then(function (data) {
      if (data.length === 0) {
        res.status(404).json({
          error:
            "the todo with the id: " + id + " doesn't exist in the database",
        });
      } else {
        res.status(200).send(data[0]);
      }
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
});

/**
 * create a new todo
 */
router.post("/", (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.status(400).json({ error: "Name can't be null" });
  } else {
    dbQuery
      .insert(name)
      .then(function (data) {
        res.status(200).send(data);
      })
      .catch(function (error) {
        res.status(500).send(error);
      });
  }
});

/**
 * modify the name of a todo by id
 */
router.put("/:id", (req, res) => {
  const name = req.body.name;
  const id = req.params.id;

  if (!name) {
    res.status(400).json({ error: "Name can't be null" });
  } else {
    dbQuery
      .update(id, name)
      .then(function (data) {
        if (data.length === 0) {
          res.status(404).json({
            error:
              "the todo with the id: " + id + " doesn't exist in the database",
          });
        } else {
          res.status(200).send(data[0]);
        }
      })
      .catch(function (error) {
        res.status(500).send(error);
      });
  }
});

/**
 * delete a todo by id
 */
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  dbQuery
    .remove(id)
    .then(function (data) {
      if (data.length === 0) {
        res.status(404).json({
          error:
            "the todo with the id: " + id + " doesn't exist in the database",
        });
      } else {
        res.status(204).send();
      }
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
});

export { router };
