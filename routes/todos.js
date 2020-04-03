// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');
var express = require('express');
var router = express.Router();
var moment = require('moment');



var todos = [{"id": 1, "name": "test", "date": "03/04/2020"}, {"id": 2, "name": "test2", "date": "03/04/2020"}]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(todos);
});

router.post('/', function(req, res, next) {
  var name = req.body.name;
  var id = uuidv4();
  var date = moment().format();

  var todo = {id, name, date}

  todos.push(todo);

  res.send(todo);
})

router.delete('/:id', function(req, res, next) {
  var id = req.params.id;

  var arrayLength = todos.length;
  todos = todos.filter(element => element.id !== id)

  if (arrayLength > todos.length) {
    res.status(200);
  } else {
    res.status(404);
  }
  res.send();
})

module.exports = router;
