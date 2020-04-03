const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();
const moment = require('moment');


const todos = [{"id": "1", "name": "test", "date": "03/04/2020"}, {"id": "2", "name": "test2", "date": "03/04/2020"}]

router.get('/', function(req, res) {
  res.send(todos);
});

router.get('/:id', (req, res) => {
  const todo = todos.find(element => element.id === req.params.id);
  if (todo) {
    res.status(200).send(todo);
  } else {
    res.status(404).send();
  }
});

router.post('/', (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.status(400).json({error: "Name can't be null"});
  } else {
    const id = uuidv4();
    const date = moment().format();

   const todo = {id, name, date}

   todos.push(todo);

   res.send(todo);
}
});

router.put('/:id', (req, res) => {
  const name = req.body.name;
  const id = req.params.id

  if (!name) {
    res.status(400).json({error: "Name can't be null"});
  } else {
    const index = todos.findIndex(element => element.id === id);
    if (index !== -1) {
      todos[index].name = name;
      res.send(todos[index]);
    } else {
      res.status(404).send();
    }
  }
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  const index = todos.findIndex(element => element.id === id)
  if (index !== -1) {
    todos.splice(index, 1);
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

module.exports = router;
