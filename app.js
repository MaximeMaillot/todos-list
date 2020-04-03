var express = require('express');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var todoRoute = require('./routes/todos')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/todos', todoRoute);


module.exports = app;
