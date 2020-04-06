import express from "express";
import logger from "morgan";
import "./env.js";
import { db } from "./db/dbConnection.js";
import { init } from "./db/migration.js";
import { router as indexRouter } from "./routes/index.js";
import { router as todoRouter } from "./routes/todos.js";

init(db);

var app = express();

app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/todos", todoRouter);

export default app;
