import express from 'express';
import logger from 'morgan';
import './env.js';
import { db } from './db/dbConnection.js'
import { router as indexRouter } from './routes/index.js';
import { router as todoRouter } from './routes/todos.js';

db.none(
    'CREATE TABLE IF NOT EXISTS todo('
    + 'id serial NOT NULL PRIMARY KEY,'
    + 'name text NOT NULL,'
    + 'date date NOT NULL DEFAULT CURRENT_DATE)')
    .then(function (data) {
      console.log('table was created if it did not exist');
    })
    .catch(function (error) {
      throw error;
    })

var app = express();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/todos', todoRouter);


export default app;
